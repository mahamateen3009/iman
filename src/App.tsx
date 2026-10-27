import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatInput } from './components/ChatInput';
import { ResponseCard } from './components/ResponseCard';
import { Welcome } from './components/Welcome';
import { AuthScreen } from './components/AuthScreen';
import { ProfileSetup } from './components/ProfileSetup';
import { DobPrompt } from './components/DobPrompt';
import { buildDynamicResponse } from './lib/dynamicResponse';
import { matchHadiths, isFatwaRequest } from './lib/hadithMatcher';
import { modernizeHadithText } from './lib/textModernizer';
import { hadithTagsMap } from './services/localHadithSource';
import { isCrisisMessage, buildCrisisResponse } from './lib/crisisResponse';
import { generateCommentary } from './lib/hadithCommentary';
import { suggestStudyTopic } from './lib/studySuggestions';
import { tryAnswerQuestion } from './lib/questionAnswer';
import {
  loadVoiceEnabled,
  saveVoiceEnabled,
  loadConversationsRemote,
  upsertConversationRemote,
  deleteConversationRemote,
  renameConversationRemote,
  loadActiveConversationId,
  saveActiveConversationId,
  type StoredConversation,
} from './lib/storage';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useAuth } from './hooks/useAuth';
import { SettingsModal } from './components/SettingsModal';
import { IslamicCalendarModal } from './components/IslamicCalendarModal';
import { PrayerTrackerModal } from './components/PrayerTrackerModal';
const DeenExplorers = lazy(() => import('./components/DeenExplorers').then((m) => ({ default: m.DeenExplorers })));
import type { AssistantResponse, ChatMessage, HadithReference } from './types/chat';
import type { Gender, UserProfile } from './types/profile';
import { ageFromDateOfBirth } from './types/profile';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function buildFullResponse(
  message: string,
  userName: string,
  isFirstMessageOfChat: boolean
): Promise<AssistantResponse> {
  if (isCrisisMessage(message)) {
    return buildCrisisResponse();
  }

  // Check if this is a factual Islamic question that we can answer directly
  const qa = tryAnswerQuestion(message);
  if (qa) {
    return {
      reflection: '',
      greeting: isFirstMessageOfChat ? `Hi ${userName}!` : undefined,
      guidance: { quote: '', translation: '', source: '', type: 'quran' },
      steps: [],
      dua: { arabic: '', transliteration: '', english: '', source: '' },
      hadiths: [],
      hadithsFromApi: false,
      requiresDisclaimer: false,
      needsScholar: false,
      isCrisis: false,
      qa,
    };
  }

  const requiresDisclaimer = isFatwaRequest(message);
  const dynamic = buildDynamicResponse(message);
  const match = await matchHadiths(message, 1);

  const hadiths: HadithReference[] = match.hadiths.map((h) => {
    const tags = hadithTagsMap.get(h.sourceLabel) ?? [];
    return {
      collection: h.collection,
      hadithNumber: h.hadithNumber,
      text: modernizeHadithText(h.text),
      arabic: h.arabic,
      sourceLabel: h.sourceLabel,
      sourceUrl: h.sourceUrl,
      grade: h.grade,
      chapter: h.chapter,
      retrievedFrom: h.retrievedFrom,
      commentary: generateCommentary(tags, match.emotions),
    };
  });

  const studySuggestion = suggestStudyTopic(match.emotions);

  // Greeting: "Hi [name]" only on the very first message of a new chat
  const greeting = isFirstMessageOfChat
    ? `Hi ${userName}!`
    : undefined;

  // Prepend user's name to reflection for personalization
  const personalizedReflection = isFirstMessageOfChat
    ? dynamic.reflection
    : `${userName}, ${dynamic.reflection.charAt(0).toLowerCase()}${dynamic.reflection.slice(1)}`;

  return {
    greeting,
    reflection: personalizedReflection,
    guidance: dynamic.guidance,
    steps: dynamic.steps,
    dua: dynamic.dua,
    hadiths,
    hadithsFromApi: match.fromApi,
    requiresDisclaimer,
    needsScholar: match.noMatch,
    isCrisis: false,
    studySuggestion,
  };
}

type ConversationPhase = 'normal' | 'awaitingFollowupAnswer' | 'awaitingFeelingsAnswer';

function App() {
  const {
    session,
    profile,
    loading: authLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    signOut,
    deleteAccount,
    saveProfile,
  } = useAuth();

  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => loadVoiceEnabled());
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [prayerOpen, setPrayerOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<StoredConversation[]>([]);

  // Conversation state machine for follow-up flow
  const phaseRef = useRef<ConversationPhase>('normal');
  const pendingQueryRef = useRef<string>('');
  const pendingStudyTopicRef = useRef<string | undefined>(undefined);
  // Tracks conversation titles the user has renamed, so the auto-title
  // logic in the persistence effect does not overwrite them.
  const renamedTitlesRef = useRef<Map<string, string>>(new Map());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { speak: speakAuto } = useSpeechSynthesis(profile);

  const userId = session?.user?.id ?? null;
  const userName = profile?.name ?? '';

  // Load conversations when user changes
  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setMessages([]);
      setActiveConversationId(null);
      return;
    }
    void (async () => {
      const remote = await loadConversationsRemote(userId);
      setConversations(remote);

      const activeId = loadActiveConversationId();
      if (activeId) {
        const active = remote.find((c) => c.id === activeId);
        if (active) {
          setMessages(active.messages);
          setActiveConversationId(activeId);
        }
      }
    })();
  }, [userId]);

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 768px)').matches;
    if (narrow) setSidebarOpen(false);
  }, []);

  // Persist messages to Supabase
  useEffect(() => {
    if (!userId || messages.length === 0) return;

    const convId = activeConversationId ?? generateId();
    const existing = conversations.find((c) => c.id === convId);
    const renamed = renamedTitlesRef.current.get(convId);
    // Preserve the existing/renamed title; only auto-generate one on the
    // very first user message of a brand-new conversation.
    const title =
      renamed ??
      existing?.title ??
      (messages.length === 1 && messages[0].role === 'user'
        ? messages[0].content.slice(0, 50)
        : messages.find((m) => m.role === 'user')?.content.slice(0, 50) ?? 'Conversation');
    const conv: StoredConversation = {
      id: convId,
      title,
      messages,
      createdAt: messages[0]?.timestamp ?? Date.now(),
      updatedAt: Date.now(),
    };
    if (!activeConversationId) {
      setActiveConversationId(convId);
      saveActiveConversationId(convId);
    }
    void upsertConversationRemote(userId, conv);
    void (async () => {
      const refreshed = await loadConversationsRemote(userId);
      setConversations(refreshed);
    })();
  }, [messages, activeConversationId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    if (sidebarOpen && userId) {
      void (async () => {
        const refreshed = await loadConversationsRemote(userId);
        setConversations(refreshed);
      })();
    }
  }, [sidebarOpen, userId]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((v) => {
      const next = !v;
      saveVoiceEnabled(next);
      return next;
    });
  }, []);

  const addAssistantMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleSend = useCallback(
    (content: string) => {
      if (!userId || !userName) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setThinking(true);

      const phase = phaseRef.current;
      const isFirstMessageOfChat = messages.length === 0;

      void (async () => {
        try {
          if (phase === 'normal') {
            // Check if this is the 2nd message in the chat and we have a study topic to ask about
            const assistantMsgs = messages.filter((m) => m.role === 'assistant' && m.response);
            const lastAssistantMsg = assistantMsgs[assistantMsgs.length - 1];
            const studyTopic = lastAssistantMsg?.response?.studySuggestion?.topic;

            if (!isFirstMessageOfChat && studyTopic) {
              // 2nd message: ask follow-up before answering
              pendingQueryRef.current = content;
              pendingStudyTopicRef.current = studyTopic;
              phaseRef.current = 'awaitingFollowupAnswer';

              const followupText = `Before I reply, tell me this first — did you study about ${studyTopic}? And did my guidance help you?`;

              const followupMsg: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: '',
                timestamp: Date.now(),
                simpleText: followupText,
              };
              setThinking(false);
              addAssistantMessage(followupMsg);

              if (voiceEnabled) speakAuto(followupText);
            } else {
              // Normal response
              const response = await buildFullResponse(content, userName, isFirstMessageOfChat);
              const assistantMsg: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: '',
                timestamp: Date.now(),
                response,
                bookmarked: false,
              };
              setMessages((prev) => [...prev, assistantMsg]);
              setThinking(false);

              if (voiceEnabled) {
                const fullText = [
                  response.greeting ?? '',
                  response.qa ? response.qa.answer : '',
                  response.reflection,
                  response.guidance.translation,
                  response.steps.join('. '),
                  response.dua.transliteration + '. ' + response.dua.english,
                ].filter(Boolean).join(' ');
                speakAuto(fullText);
              }
            }
          } else if (phase === 'awaitingFollowupAnswer') {
            // User answered the follow-up. Now ask about their feelings.
            phaseRef.current = 'awaitingFeelingsAnswer';

            const feelingsText = `Thank you for sharing that, ${userName}. Now, how are you feeling? What is on your mind and heart right now?`;

            const feelingsMsg: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: '',
              timestamp: Date.now(),
              simpleText: feelingsText,
            };
            setThinking(false);
            addAssistantMessage(feelingsMsg);

            if (voiceEnabled) speakAuto(feelingsText);
          } else if (phase === 'awaitingFeelingsAnswer') {
            // User shared their feelings. Now give the full response to their pending query.
            const pendingQuery = pendingQueryRef.current || content;
            phaseRef.current = 'normal';

            const response = await buildFullResponse(pendingQuery, userName, false);
            const assistantMsg: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: '',
              timestamp: Date.now(),
              response,
              bookmarked: false,
            };
            setMessages((prev) => [...prev, assistantMsg]);
            setThinking(false);

            if (voiceEnabled) {
              const fullText = [
                response.qa ? response.qa.answer : '',
                response.reflection,
                response.guidance.translation,
                response.steps.join('. '),
                response.dua.transliteration + '. ' + response.dua.english,
              ].filter(Boolean).join(' ');
              speakAuto(fullText);
            }

            pendingQueryRef.current = '';
            pendingStudyTopicRef.current = undefined;
          }
        } catch {
          setThinking(false);
          phaseRef.current = 'normal';
        }
      })();
    },
    [voiceEnabled, speakAuto, userId, userName, messages, addAssistantMessage]
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setActiveConversationId(null);
    saveActiveConversationId(null);
    phaseRef.current = 'normal';
    pendingQueryRef.current = '';
    pendingStudyTopicRef.current = undefined;
  }, []);

  const handleSelectConversation = useCallback((conv: StoredConversation) => {
    setMessages(conv.messages);
    setActiveConversationId(conv.id);
    saveActiveConversationId(conv.id);
    phaseRef.current = 'normal';
    pendingQueryRef.current = '';
    pendingStudyTopicRef.current = undefined;
    if (window.matchMedia('(max-width: 768px)').matches) setSidebarOpen(false);
  }, []);

  const handleDeleteConversation = useCallback(
    (id: string) => {
      void deleteConversationRemote(id);
      if (userId) {
        void (async () => {
          const refreshed = await loadConversationsRemote(userId);
          setConversations(refreshed);
        })();
      }
      if (id === activeConversationId) {
        handleNewChat();
      }
    },
    [activeConversationId, handleNewChat, userId]
  );

  const handleRenameConversation = useCallback(
    (id: string, title: string) => {
      renamedTitlesRef.current.set(id, title);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c))
      );
      void renameConversationRemote(id, title);
    },
    [userId]
  );

  const toggleBookmark = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, bookmarked: !m.bookmarked } : m))
    );
  }, []);

  const bookmarks = useMemo(
    () => messages.filter((m) => m.role === 'assistant' && m.bookmarked),
    [messages]
  );

  const handleQuickStart = useCallback(
    (prompt: string) => {
      handleSend(prompt);
      if (window.matchMedia('(max-width: 768px)').matches) setSidebarOpen(false);
    },
    [handleSend]
  );

  const handleProfileSubmit = useCallback(
    async (data: { name: string; age: number; dateOfBirth: string; gender: Gender }) => {
      if (!session?.user) return;
      const isYoung = data.age <= 18;
      const isFemale = data.gender === 'female';
      await saveProfile({
        name: data.name,
        age: data.age,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        voice_pitch: isFemale ? (isYoung ? 1.25 : 1.12) : (isYoung ? 1.08 : 0.85),
        voice_rate: isYoung ? 0.88 : 0.75,
      });
    },
    [session, saveProfile]
  );

  const handleDeleteAccount = useCallback(async () => {
    const { error } = await deleteAccount();
    if (error) return error;
    setMessages([]);
    setActiveConversationId(null);
    saveActiveConversationId(null);
    phaseRef.current = 'normal';
    pendingQueryRef.current = '';
    pendingStudyTopicRef.current = undefined;
    return null;
  }, [deleteAccount]);

  const handleSignOut = useCallback(() => {
    void signOut();
    setMessages([]);
    setActiveConversationId(null);
    saveActiveConversationId(null);
    phaseRef.current = 'normal';
    pendingQueryRef.current = '';
    pendingStudyTopicRef.current = undefined;
  }, [signOut]);

  // Auth gate: show loading state
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream-50 dark:bg-ink-900">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" />
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" style={{ animationDelay: '0.2s' }} />
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-sm text-emerald-900/60 dark:text-ink-300">Loading…</p>
        </div>
      </div>
    );
  }

  // Auth gate: not signed in
  if (!session) {
    return (
      <AuthScreen
        onSignIn={signInWithEmail}
        onSignUp={signUpWithEmail}
        onGoogleSignIn={signInWithGoogle}
        onResetPassword={resetPassword}
      />
    );
  }

  // Profile gate: signed in but no profile yet
  if (session && !profile && !authLoading) {
    return (
      <ProfileSetup
        email={session.user?.email ?? ''}
        onSubmit={handleProfileSubmit}
      />
    );
  }

  // Profile still loading
  if (session && !profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream-50 dark:bg-ink-900">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" />
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" style={{ animationDelay: '0.2s' }} />
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-sm text-emerald-900/60 dark:text-ink-300">Setting up your space…</p>
        </div>
      </div>
    );
  }

  // DOB gate: existing users who signed up before date-of-birth existed.
  if (session && profile && !profile.date_of_birth) {
    const saveDob = async (dob: string) => {
      await saveProfile({ date_of_birth: dob, age: ageFromDateOfBirth(dob) });
    };
    return <DobPrompt profile={profile} onSubmit={saveDob} />;
  }

  const hasMessages = messages.length > 0;

  // Age is derived from date of birth so it stays correct over time.
  const effectiveAge =
    ageFromDateOfBirth(profile?.date_of_birth) ?? profile?.age ?? null;

  return (
    <div className="flex h-screen flex-col bg-cream-50 text-emerald-900 dark:bg-ink-900 dark:text-cream-50">
      <Navbar
        theme="light"
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenCalendar={() => setCalendarOpen(true)}
        onOpenGame={() => setGameOpen(true)}
        onOpenPrayer={() => setPrayerOpen(true)}
        sidebarOpen={sidebarOpen}
        userName={userName}
        age={effectiveAge}
        onSignOut={handleSignOut}
      />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          bookmarks={bookmarks}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          onToggleBookmark={toggleBookmark}
          onQuickStart={handleQuickStart}
        />

        <main className="flex min-h-0 flex-1 flex-col">
          <div
            ref={scrollContainerRef}
            className="scrollbar-thin min-h-0 flex-1 overflow-y-auto"
          >
            {!hasMessages ? (
              <Welcome onQuickStart={handleQuickStart} userName={userName} />
            ) : (
              <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
                {messages.map((msg) =>
                  msg.role === 'user' ? (
                    <UserBubble key={msg.id} message={msg} />
                  ) : msg.simpleText ? (
                    <SimpleAssistantBubble key={msg.id} text={msg.simpleText} />
                  ) : (
                    <ResponseCard
                      key={msg.id}
                      message={msg}
                      bookmarked={!!msg.bookmarked}
                      onToggleBookmark={toggleBookmark}
                      profile={profile}
                    />
                  )
                )}
                {thinking && <ThinkingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <ChatInput onSend={handleSend} disabled={thinking} />
        </main>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={profile}
        email={session?.user?.email ?? null}
        effectiveAge={effectiveAge}
        onDeleteAccount={handleDeleteAccount}
      />

      <IslamicCalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
      />

      <PrayerTrackerModal
        open={prayerOpen}
        onClose={() => setPrayerOpen(false)}
        userId={userId ?? ''}
      />

      {(effectiveAge == null || effectiveAge <= 14) && (
        <Suspense fallback={null}>
        <DeenExplorers
          open={gameOpen}
          onClose={() => setGameOpen(false)}
          userId={userId ?? ''}
          age={effectiveAge}
        />
        </Suspense>
      )}
    </div>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="animate-fade-in-up flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-br from-emerald-800 to-emerald-700 px-4 py-3 text-sm leading-relaxed text-cream-50 shadow-soft">
        {message.content}
      </div>
    </div>
  );
}

function SimpleAssistantBubble({ text }: { text: string }) {
  return (
    <div className="animate-fade-in-up flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-emerald-900/10 bg-white/80 px-4 py-3 text-sm leading-relaxed text-emerald-900 shadow-card dark:border-gold-400/12 dark:bg-ink-800/70 dark:text-cream-50">
        {text}
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="animate-fade-in flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white/60 px-5 py-4 dark:border-gold-400/12 dark:bg-ink-800/50">
      <div className="flex gap-1.5">
        <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" />
        <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" style={{ animationDelay: '0.2s' }} />
        <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" style={{ animationDelay: '0.4s' }} />
      </div>
      <p className="text-sm text-emerald-900/60 dark:text-ink-300">
        Iman is reflecting on your message…
      </p>
    </div>
  );
}

export default App;
