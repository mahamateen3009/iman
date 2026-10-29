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
import { generateGemmaResponse } from './lib/gemmaChat';
import { modernizeHadithText } from './lib/textModernizer';
import { hadithTagsMap } from './services/localHadithSource';
import { isCrisisMessage, buildCrisisResponse } from './lib/crisisResponse';
import { generateCommentary } from './lib/hadithCommentary';
import { tryAnswerQuestion } from './lib/questionAnswer';
import { tryConversationalResponse, isStressOrGuidanceRequest, getFriendlyCompanionResponse } from './lib/conversationalChat';
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
import { Globe, ExternalLink } from 'lucide-react';
import { askGemini, isGeminiConfigured } from './services/geminiService';
import {
  isProjectQuestion,
  getProjectAnswer,
  isIslamicHistoryOrTeachingQuestion,
  scrapeIslamicHistory,
} from './services/islamicWebSearch';
import type { AssistantResponse, ChatMessage, HadithReference, WebSource } from './types/chat';
import type { Gender, UserProfile, AgeGroup } from './types/profile';
import { ageFromDateOfBirth, ageGroupFromAge } from './types/profile';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ProfileContext {
  name: string;
  ageGroup: string | null;
  gender: string | null;
  age?: number | null;
}

async function buildFullResponse(
  message: string,
  userName: string,
  isFirstMessageOfChat: boolean,
  history: ChatHistoryMessage[],
  profileContext: ProfileContext
): Promise<AssistantResponse> {
  if (isCrisisMessage(message)) {
    return buildCrisisResponse();
  }

  // Check if this is a factual Islamic question that we can answer directly
  const qa = tryAnswerQuestion(message);
  if (qa) {
    return {
      reflection: '',
      greeting: isFirstMessageOfChat ? `Assalamu Alaikum ${userName}!` : undefined,
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
  const dynamic = buildDynamicResponse(message, {
    name: userName,
    age: profileContext.age,
    ageGroup: profileContext.ageGroup as 'child' | 'teen' | 'adult' | null,
    gender: profileContext.gender,
  });
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

  // Soft, warm greeting on the very first message
  let greeting: string | undefined;
  if (isFirstMessageOfChat && userName) {
    if (profileContext.age != null && profileContext.age <= 12) {
      greeting = `Assalamu Alaikum little ${userName}! 🌿 I am your companion Iman. How can I help your heart today?`;
    } else if (profileContext.age != null && profileContext.age >= 60) {
      greeting = `Assalamu Alaikum wa Rahmatullah, respected ${userName}. May Allah grant you tranquility and ease.`;
    } else {
      greeting = `Assalamu Alaikum, ${userName}. I am here to listen and help whenever you need guidance or comfort.`;
    }
  }

  let reflection: string = dynamic.reflection;
  let steps: string[] = dynamic.steps;

  const gemmaResult = await generateGemmaResponse(
    message,
    history,
    match.emotions,
    hadiths,
    profileContext
  );

  if (gemmaResult) {
    reflection = gemmaResult.reflection;
    if (gemmaResult.steps.length > 0) {
      steps = gemmaResult.steps;
    }
  }

  return {
    greeting,
    reflection,
    guidance: dynamic.guidance,
    steps,
    dua: dynamic.dua,
    hadiths,
    hadithsFromApi: match.fromApi,
    requiresDisclaimer,
    needsScholar: match.noMatch,
    isCrisis: false,
  };
}

function stripMarkdownForVoice(text: string): string {
  return text.replace(/[*#_`>]/g, '').trim();
}

function buildChatHistory(messages: ChatMessage[]): ChatHistoryMessage[] {
  return messages.slice(-12).map((m) => {
    if (m.role === 'assistant') {
      const text = m.simpleText
        ?? [m.response?.greeting, m.response?.reflection, m.response?.guidance.translation]
            .filter(Boolean).join(' ');
      return { role: 'assistant', content: text };
    }
    return { role: 'user', content: m.content };
  });
}

function buildProfileContext(profile: UserProfile | null, age: number | null): ProfileContext {
  return {
    name: profile?.name ?? '',
    ageGroup: ageGroupFromAge(age) ?? null,
    gender: profile?.gender ?? null,
    age: age ?? profile?.age ?? null,
  };
}

function App() {
  const {
    session,
    profile,
    loading: authLoading,
    signInWithEmail,
    signUpWithEmail,
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

      const activeId = loadActiveConversationId(userId);
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
      saveActiveConversationId(userId, convId);
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

      const isFirstMessageOfChat = messages.length === 0;

      void (async () => {
        try {
          const age = ageFromDateOfBirth(profile?.date_of_birth) ?? profile?.age ?? null;
          const profileContext = buildProfileContext(profile, age);
          const chatHistory = buildChatHistory(messages);

          // 1. Check if the message is a conversational greeting, question, friendship offer, or chitchat
          const conversationalText = tryConversationalResponse(
            content,
            {
              name: userName,
              age: profileContext.age,
              ageGroup: profileContext.ageGroup as 'child' | 'teen' | 'adult' | null,
            },
            chatHistory
          );

          if (conversationalText) {
            const assistantMsg: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: '',
              timestamp: Date.now(),
              simpleText: conversationalText,
            };
            setMessages((prev) => [...prev, assistantMsg]);
            setThinking(false);

            if (voiceEnabled) {
              speakAuto(stripMarkdownForVoice(conversationalText));
            }
            return;
          }

          // 2. Check if the user is in stress, asking for a dua, or seeking Islamic emotional guidance
          if (isStressOrGuidanceRequest(content, chatHistory)) {
            const response = await buildFullResponse(content, userName, isFirstMessageOfChat, chatHistory, profileContext);
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
                response.reflection,
                response.guidance.translation,
                response.steps.join('. '),
                response.dua.transliteration + '. ' + response.dua.english,
              ].filter(Boolean).join(' ');
              speakAuto(fullText);
            }
            return;
          }

          // 3. Check if this is a question about the Iman project or its features
          if (isProjectQuestion(content)) {
            if (isGeminiConfigured()) {
              const geminiResp = await askGemini(content, chatHistory, {
                userName,
                age: profileContext.age,
                ageGroup: profileContext.ageGroup as any,
                gender: profileContext.gender,
              });
              if (geminiResp?.text) {
                const assistantMsg: ChatMessage = {
                  id: generateId(),
                  role: 'assistant',
                  content: '',
                  timestamp: Date.now(),
                  simpleText: geminiResp.text,
                  webSources: geminiResp.webSources,
                };
                setMessages((prev) => [...prev, assistantMsg]);
                setThinking(false);
                if (voiceEnabled) speakAuto(stripMarkdownForVoice(geminiResp.text));
                return;
              }
            }

            const projectText = getProjectAnswer(content, userName);
            const assistantMsg: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: '',
              timestamp: Date.now(),
              simpleText: projectText,
            };
            setMessages((prev) => [...prev, assistantMsg]);
            setThinking(false);
            if (voiceEnabled) speakAuto(stripMarkdownForVoice(projectText));
            return;
          }

          // 4. Try Gemini AI with live web search grounding (for Islamic teachings, history, and questions)
          if (isGeminiConfigured()) {
            const geminiResp = await askGemini(content, chatHistory, {
              userName,
              age: profileContext.age,
              ageGroup: profileContext.ageGroup as any,
              gender: profileContext.gender,
            });

            if (geminiResp?.text) {
              const assistantMsg: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: '',
                timestamp: Date.now(),
                simpleText: geminiResp.text,
                webSources: geminiResp.webSources,
              };
              setMessages((prev) => [...prev, assistantMsg]);
              setThinking(false);
              if (voiceEnabled) speakAuto(stripMarkdownForVoice(geminiResp.text));
              return;
            }
          }

          // 5. If Gemini is not configured yet or didn't return, check for Islamic History web scraping
          if (isIslamicHistoryOrTeachingQuestion(content)) {
            const scraped = await scrapeIslamicHistory(content);
            if (scraped) {
              const historyText = `**${scraped.title}**\n\n${scraped.extract}\n\n*(Tip: Add your Gemini API key in Settings or .env to unlock full live web research and Q&A!)*`;
              const assistantMsg: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: '',
                timestamp: Date.now(),
                simpleText: historyText,
                webSources: [{ title: scraped.title, url: scraped.sourceUrl }],
              };
              setMessages((prev) => [...prev, assistantMsg]);
              setThinking(false);
              if (voiceEnabled) speakAuto(stripMarkdownForVoice(scraped.extract));
              return;
            }
          }

          // 6. Check if this is a factual Islamic QA question (e.g. "is music haram?", "how to do wudu?")
          const qa = tryAnswerQuestion(content);
          if (qa) {
            const assistantMsg: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: '',
              timestamp: Date.now(),
              response: {
                reflection: '',
                guidance: { quote: '', translation: '', source: '', type: 'quran' },
                steps: [],
                dua: { arabic: '', transliteration: '', english: '', source: '' },
                hadiths: [],
                hadithsFromApi: false,
                requiresDisclaimer: false,
                needsScholar: false,
                isCrisis: false,
                qa,
              },
              bookmarked: false,
            };
            setMessages((prev) => [...prev, assistantMsg]);
            setThinking(false);
            if (voiceEnabled) speakAuto(qa.answer);
            return;
          }

          // 7. Fallback friendly companion response
          const friendlyFallback = getFriendlyCompanionResponse(
            content,
            {
              name: userName,
              age: profileContext.age,
              ageGroup: profileContext.ageGroup as 'child' | 'teen' | 'adult' | null,
            },
            chatHistory
          );

          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
            simpleText: friendlyFallback,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setThinking(false);

          if (voiceEnabled) {
            speakAuto(stripMarkdownForVoice(friendlyFallback));
          }
        } catch {
          setThinking(false);
        }
      })();
    },
    [voiceEnabled, speakAuto, userId, userName, messages, profile]
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setActiveConversationId(null);
    if (userId) saveActiveConversationId(userId, null);
  }, [userId]);

  const handleSelectConversation = useCallback((conv: StoredConversation) => {
    setMessages(conv.messages);
    setActiveConversationId(conv.id);
    if (userId) saveActiveConversationId(userId, conv.id);
    if (window.matchMedia('(max-width: 768px)').matches) setSidebarOpen(false);
  }, [userId]);

  const handleDeleteConversation = useCallback(
    (id: string) => {
      void deleteConversationRemote(userId ?? '', id);
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
      void renameConversationRemote(userId ?? '', id, title);
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
    const currentUserId = userId;
    const { error } = await deleteAccount();
    if (error) return error;
    setMessages([]);
    setActiveConversationId(null);
    if (currentUserId) saveActiveConversationId(currentUserId, null);
    return null;
  }, [deleteAccount, userId]);

  const handleSignOut = useCallback(() => {
    const currentUserId = userId;
    void signOut();
    setMessages([]);
    setActiveConversationId(null);
    if (currentUserId) saveActiveConversationId(currentUserId, null);
  }, [signOut, userId]);

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
                    <SimpleAssistantBubble key={msg.id} text={msg.simpleText} webSources={msg.webSources} />
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

function SimpleAssistantBubble({
  text,
  webSources,
}: {
  text: string;
  webSources?: WebSource[];
}) {
  return (
    <div className="animate-fade-in-up flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-emerald-900/10 bg-white/80 px-4 py-3 text-sm leading-relaxed text-emerald-900 shadow-card dark:border-gold-400/12 dark:bg-ink-800/70 dark:text-cream-50">
        <div className="whitespace-pre-wrap">{text}</div>

        {webSources && webSources.length > 0 && (
          <div className="mt-3 border-t border-emerald-900/10 pt-2.5 dark:border-gold-400/15">
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-gold-300">
              <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-gold-400" />
              <span>Web Sources & Grounding</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {webSources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-900/8 px-2.5 py-1 text-[10px] font-medium text-emerald-800 transition hover:bg-emerald-700/15 hover:text-emerald-900 dark:bg-gold-400/10 dark:text-gold-200 dark:hover:bg-gold-400/20"
                >
                  <span className="truncate max-w-[200px]">{source.title}</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-70 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
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
