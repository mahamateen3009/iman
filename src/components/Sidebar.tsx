import { useState } from 'react';
import {
  Bookmark,
  BookmarkX,
  MessageSquarePlus,
  Heart,
  Sparkles,
  Wind,
  Shield,
  Flame,
  X,
  Trash2,
  MessageCircle,
  Pencil,
  Check,
  ChevronRight,
  Download,
} from 'lucide-react';
import type { ChatMessage } from '../types/chat';
import type { DuaCategory, Dua } from '../types/chat';
import { DUA_CATEGORY_LABELS } from '../types/chat';
import type { StoredConversation } from '../lib/storage';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  conversations: StoredConversation[];
  activeConversationId: string | null;
  bookmarks: ChatMessage[];
  onNewChat: () => void;
  onSelectConversation: (conv: StoredConversation) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onToggleBookmark: (id: string) => void;
  onQuickStart: (prompt: string) => void;
}

const QUICK_STARTS = [
  { label: 'Feeling anxious', prompt: 'I have been feeling really anxious lately and my mind wont stop racing.', icon: Wind },
  { label: 'Need daily motivation', prompt: 'I need motivation to build better daily habits and stop procrastinating.', icon: Flame },
  { label: 'Seeking patience', prompt: 'I am going through a difficult trial and I need help finding patience.', icon: Shield },
  { label: 'Overcoming fear', prompt: 'I am struggling with fear and I want to overcome it with faith.', icon: Heart },
];

export function Sidebar({
  open,
  onClose,
  conversations,
  activeConversationId,
  bookmarks,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onToggleBookmark,
  onQuickStart,
}: SidebarProps) {
  const [tab, setTab] = useState<'conversations' | 'bookmarks'>('conversations');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedBookmark, setSelectedBookmark] = useState<ChatMessage | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<DuaCategory | null>(null);

  const categorize = (dua: Dua | undefined): DuaCategory =>
    (dua?.category ?? 'general') as DuaCategory;

  const groupedBookmarks = bookmarks.reduce<Record<string, ChatMessage[]>>((acc, msg) => {
    if (!msg.response?.dua) return acc;
    const cat = categorize(msg.response.dua);
    (acc[cat] ??= []).push(msg);
    return acc;
  }, {});

  const categoryOrder: DuaCategory[] = Object.keys(DUA_CATEGORY_LABELS) as DuaCategory[];
  const sortedCategories = Object.keys(groupedBookmarks).sort(
    (a, b) => categoryOrder.indexOf(a as DuaCategory) - categoryOrder.indexOf(b as DuaCategory)
  ) as DuaCategory[];

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditValue(currentTitle);
  };

  const commitRename = () => {
    if (editingId && editValue.trim()) {
      onRenameConversation(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditValue('');
  };

  const exportSavedDuas = () => {
    const content = bookmarks
      .filter((message) => message.response?.dua)
      .map((message, index) => {
        const dua = message.response!.dua;
        return `${index + 1}. ${DUA_CATEGORY_LABELS[categorize(dua)]}\n\nArabic:\n${dua.arabic}\n\nTransliteration:\n${dua.transliteration}\n\nMeaning:\n${dua.english}\n\nSource: ${dua.source}`;
      })
      .join('\n\n------------------------------\n\n');
    const blob = new Blob([`Saved Duas\n\n${content}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'saved-duas.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-20 flex h-[calc(100vh-4rem)] w-72 flex-col border-r border-emerald-900/10 bg-cream-100/80 backdrop-blur-md transition-transform duration-300 dark:border-gold-400/15 dark:bg-ink-800/80 md:relative md:top-0 md:h-full ${
          open ? 'translate-x-0' : '-translate-x-full md:w-0 md:border-r-0 md:overflow-hidden'
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <button
            onClick={onNewChat}
            className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 px-4 py-2.5 text-sm font-semibold text-cream-50 shadow-soft transition-all hover:from-emerald-700 hover:to-emerald-600"
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Conversation
          </button>

          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-900/50 dark:text-ink-300">
            Quick Start
          </p>
          <div className="mb-4 grid gap-2">
            {QUICK_STARTS.map((qs) => {
              const Icon = qs.icon;
              return (
                <button
                  key={qs.label}
                  onClick={() => onQuickStart(qs.prompt)}
                  className="group flex items-center gap-2.5 rounded-xl border border-emerald-900/10 bg-white/70 px-3 py-2 text-left text-sm text-emerald-900 transition-all hover:border-emerald-700/30 hover:bg-emerald-700/5 dark:border-gold-400/10 dark:bg-ink-700/50 dark:text-cream-50 dark:hover:border-gold-400/30 dark:hover:bg-gold-400/5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-900/8 text-emerald-800 transition-colors group-hover:bg-emerald-700/15 dark:bg-gold-400/10 dark:text-gold-300">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-tight">{qs.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-3 flex gap-1 rounded-lg bg-emerald-900/8 p-1 dark:bg-ink-700/50">
            <button
              onClick={() => setTab('conversations')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === 'conversations'
                  ? 'bg-white text-emerald-900 shadow-soft dark:bg-ink-600 dark:text-cream-50'
                  : 'text-emerald-900/60 dark:text-ink-300'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chats
            </button>
            <button
              onClick={() => setTab('bookmarks')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === 'bookmarks'
                  ? 'bg-white text-emerald-900 shadow-soft dark:bg-ink-600 dark:text-cream-50'
                  : 'text-emerald-900/60 dark:text-ink-300'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              Saved
            </button>
          </div>

          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
            {tab === 'bookmarks' && bookmarks.length > 0 && (
              <button onClick={exportSavedDuas} className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-700/20 bg-white/60 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-700/10 dark:border-gold-400/20 dark:bg-ink-700/40 dark:text-gold-300 dark:hover:bg-gold-400/10">
                <Download className="h-3.5 w-3.5" />
                Export saved duas
              </button>
            )}
            {tab === 'conversations' ? (
              conversations.length === 0 ? (
                <EmptyState
                  icon={MessageCircle}
                  text="Your conversations will appear here."
                />
              ) : (
                <ul className="space-y-1">
                  {conversations.map((conv) => (
                    <li key={conv.id}>
                      <div
                        className={`group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                          conv.id === activeConversationId
                            ? 'bg-emerald-700/12 dark:bg-gold-400/10'
                            : 'hover:bg-emerald-900/8 dark:hover:bg-gold-400/8'
                        }`}
                      >
                        {editingId === conv.id ? (
                          <>
                            <input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') commitRename();
                                if (e.key === 'Escape') cancelRename();
                              }}
                              className="flex-1 rounded-md border border-emerald-700/30 bg-white/90 px-2 py-1 text-sm text-emerald-900 focus:border-emerald-600 focus:outline-none dark:border-gold-400/30 dark:bg-ink-600 dark:text-cream-50"
                            />
                            <button
                              onClick={commitRename}
                              className="shrink-0 rounded-md p-1 text-emerald-700 hover:bg-emerald-700/15 dark:text-gold-300"
                              aria-label="Save name"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={cancelRename}
                              className="shrink-0 rounded-md p-1 text-emerald-900/40 hover:bg-red-500/15 hover:text-red-500 dark:text-ink-400 dark:hover:text-red-400"
                              aria-label="Cancel rename"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => onSelectConversation(conv)}
                              className="flex-1 truncate text-left text-sm text-emerald-900/80 dark:text-ink-200"
                              title={conv.title}
                            >
                              {conv.title}
                            </button>
                            <button
                              onClick={() => startEditing(conv.id, conv.title)}
                              className="shrink-0 rounded-md p-1 text-emerald-900/40 opacity-0 transition-all hover:bg-emerald-700/15 hover:text-emerald-700 group-hover:opacity-100 dark:text-ink-400 dark:hover:text-gold-300"
                              aria-label="Rename conversation"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteConversation(conv.id)}
                              className="shrink-0 rounded-md p-1 text-emerald-900/40 opacity-0 transition-all hover:bg-red-500/15 hover:text-red-500 group-hover:opacity-100 dark:text-ink-400 dark:hover:text-red-400"
                              aria-label="Delete conversation"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : bookmarks.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                text="Bookmark guidance to save it here for later."
              />
            ) : (
              <div className="space-y-3">
                {sortedCategories.map((cat) => {
                  const items = groupedBookmarks[cat] ?? [];
                  if (items.length === 0) return null;
                  const isOpen = expandedCategory === cat;
                  return (
                    <div key={cat} className="overflow-hidden rounded-lg border border-emerald-900/8 bg-white/40 dark:border-gold-400/8 dark:bg-ink-700/30">
                      <button
                        onClick={() => setExpandedCategory(isOpen ? null : cat)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-emerald-900/5 dark:hover:bg-gold-400/5"
                      >
                        <span className="text-xs font-semibold text-emerald-900 dark:text-cream-50">
                          {DUA_CATEGORY_LABELS[cat]}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-700/60 dark:text-gold-300/60">
                          {items.length}
                          <ChevronRight className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                        </span>
                      </button>
                      {isOpen && (
                        <ul className="space-y-2 px-2 pb-2">
                          {items.map((msg) => (
                            <li key={msg.id}>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedBookmark(msg)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') setSelectedBookmark(msg);
                                }}
                                className="w-full rounded-lg border border-emerald-900/8 bg-cream-50/60 px-3 py-2.5 text-left transition-colors hover:bg-emerald-900/8 dark:border-gold-400/8 dark:bg-ink-800/40 dark:hover:bg-gold-400/8"
                              >
                                {msg.response && (
                                  <>
                                    <p
                                      dir="rtl"
                                      lang="ar"
                                      className="truncate text-right font-arabic text-base leading-snug text-emerald-900 dark:text-gold-200"
                                    >
                                      {msg.response.dua.arabic}
                                    </p>
                                    <p className="mt-0.5 truncate text-[11px] italic text-emerald-800/70 dark:text-cream-200/70">
                                      {msg.response.dua.transliteration}
                                    </p>
                                    <span className="mt-2 flex items-center justify-end text-[10px] text-emerald-700/60 dark:text-gold-300/60">
                                      <button
                                        type="button"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          onToggleBookmark(msg.id);
                                        }}
                                        className="rounded-md p-1.5 text-emerald-700/60 transition hover:bg-rose-500/10 hover:text-rose-600 dark:text-gold-300/60 dark:hover:text-rose-300"
                                        aria-label="Unsave dua"
                                        title="Unsave dua"
                                      >
                                        <BookmarkX className="h-3.5 w-3.5" />
                                      </button>
                                    </span>
                                  </>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-900/6 px-3 py-2.5 dark:bg-gold-400/6">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-500 dark:text-gold-300" />
            <p className="text-[10px] leading-tight text-emerald-900/60 dark:text-ink-300">
              Guidance is for support and reflection. For religious rulings, consult a qualified scholar.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-lg p-1.5 text-emerald-900/60 hover:bg-emerald-900/10 dark:text-ink-300 dark:hover:bg-gold-400/10 md:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </aside>

      {selectedBookmark?.response && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedBookmark(null)}
            aria-label="Close saved dua"
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-gold-400/30 bg-cream-50 p-5 shadow-card dark:border-gold-400/20 dark:bg-ink-800 sm:p-7">
            <button
              type="button"
              onClick={() => setSelectedBookmark(null)}
              className="absolute right-3 top-3 rounded-lg p-2 text-emerald-900/60 transition hover:bg-emerald-900/10 dark:text-ink-300 dark:hover:bg-gold-400/10"
              aria-label="Close saved dua"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="mb-4 pr-8 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-300">
              Saved Du'a
              {selectedBookmark.response.dua.category && (
                <span className="ml-2 normal-case tracking-normal text-emerald-700/60 dark:text-gold-300/60">
                  · {DUA_CATEGORY_LABELS[selectedBookmark.response.dua.category]}
                </span>
              )}
            </p>
            <div className="mb-5 pr-8">
              <p dir="rtl" lang="ar" className="text-right font-arabic text-3xl leading-loose text-emerald-900 dark:text-gold-200">
                {selectedBookmark.response.dua.arabic}
              </p>
            </div>
            <p className="mb-2 text-base font-medium italic text-emerald-800 dark:text-cream-100">
              {selectedBookmark.response.dua.transliteration}
            </p>
            <p className="text-sm leading-relaxed text-emerald-900/80 dark:text-ink-200">
              {selectedBookmark.response.dua.english}
            </p>
            <p className="mt-4 text-xs text-emerald-700/70 dark:text-gold-300/70">
              {selectedBookmark.response.dua.source}
            </p>
            <button
              type="button"
              onClick={() => {
                onToggleBookmark(selectedBookmark.id);
                setSelectedBookmark(null);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-400/40 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/10 dark:text-rose-300"
            >
              <BookmarkX className="h-3.5 w-3.5" />
              Unsave dua
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState({ icon: Icon, text }: { icon: typeof MessageCircle; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <Icon className="h-7 w-7 text-emerald-900/25 dark:text-ink-500" />
      <p className="text-xs text-emerald-900/50 dark:text-ink-400">{text}</p>
    </div>
  );
}
