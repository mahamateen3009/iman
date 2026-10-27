import { supabase } from './supabaseClient';
import type { ChatMessage } from '../types/chat';
import type { HadithSourceConfig } from '../types/hadith';
import { DEFAULT_HADITH_CONFIG } from '../services/hadithApi';

export interface StoredConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

/* ─── Local-storage helpers (settings only) ─── */

const THEME_KEY = 'noor_theme';
const VOICE_KEY = 'noor_voice_enabled';
const HADITH_CONFIG_KEY = 'noor_hadith_config';

export type ThemeMode = 'light' | 'dark';

export function loadTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function loadVoiceEnabled(): boolean {
  try {
    return localStorage.getItem(VOICE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveVoiceEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(VOICE_KEY, String(enabled));
  } catch {
    /* ignore */
  }
}

export function loadHadithConfig(): HadithSourceConfig {
  try {
    const raw = localStorage.getItem(HADITH_CONFIG_KEY);
    if (!raw) return { ...DEFAULT_HADITH_CONFIG };
    const parsed = JSON.parse(raw) as Partial<HadithSourceConfig>;
    return {
      mode: parsed.mode === 'sunnahOfficial' ? 'sunnahOfficial' : 'hybrid',
      sunnahApiKey: typeof parsed.sunnahApiKey === 'string' ? parsed.sunnahApiKey : '',
    };
  } catch {
    return { ...DEFAULT_HADITH_CONFIG };
  }
}

export function saveHadithConfig(config: HadithSourceConfig): void {
  try {
    localStorage.setItem(HADITH_CONFIG_KEY, JSON.stringify(config));
  } catch {
    /* ignore */
  }
}

/* ─── Supabase-backed conversation helpers ─── */

function isMockUser(userId: string): boolean {
  return userId.startsWith('mock-');
}

export async function loadConversationsRemote(userId: string): Promise<StoredConversation[]> {
  if (isMockUser(userId)) {
    return loadConversations(userId).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 50);
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, messages, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    messages: (row.messages as ChatMessage[]) ?? [],
    createdAt: new Date(row.created_at as string).getTime(),
    updatedAt: new Date(row.updated_at as string).getTime(),
  }));
}

export async function upsertConversationRemote(
  userId: string,
  conv: StoredConversation
): Promise<void> {
  if (isMockUser(userId)) {
    upsertConversation(userId, conv);
    return;
  }

  const { error } = await supabase
    .from('conversations')
    .upsert({
      id: conv.id,
      user_id: userId,
      title: conv.title,
      messages: conv.messages,
      created_at: new Date(conv.createdAt).toISOString(),
      updated_at: new Date(conv.updatedAt).toISOString(),
    });
  if (error) {
    console.error('[upsertConversationRemote]', error.message, { id: conv.id, userId });
  }
}

export async function deleteConversationRemote(userId: string, id: string): Promise<void> {
  if (isMockUser(userId)) {
    deleteConversation(userId, id);
    return;
  }
  await supabase.from('conversations').delete().eq('id', id);
}

export async function renameConversationRemote(userId: string, id: string, title: string): Promise<boolean> {
  if (isMockUser(userId)) {
    const all = loadConversations(userId);
    const idx = all.findIndex((c) => c.id === id);
    if (idx < 0) return false;
    all[idx].title = title;
    saveConversations(userId, all);
    return true;
  }

  const { data, error } = await supabase
    .from('conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error || !data) {
    console.error('[renameConversationRemote]', error?.message ?? 'Conversation was not found', { id });
    return false;
  }
  return true;
}

/* ─── Per-user localStorage conversation helpers ─── */

const HISTORY_KEY = 'noor_chat_history';

function conversationsKey(userId: string): string {
  return `noor_conversations_${userId}`;
}

function activeConversationKey(userId: string): string {
  return `noor_active_conversation_${userId}`;
}

export function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveHistory(messages: ChatMessage[]): void {
  try {
    const trimmed = messages.slice(-100);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    /* ignore */
  }
}

export function clearHistoryStorage(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* ignore */
  }
}

export function loadConversations(userId: string): StoredConversation[] {
  try {
    const raw = localStorage.getItem(conversationsKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveConversations(userId: string, conversations: StoredConversation[]): void {
  try {
    const trimmed = conversations.slice(-50);
    localStorage.setItem(conversationsKey(userId), JSON.stringify(trimmed));
  } catch {
    /* ignore */
  }
}

export function upsertConversation(userId: string, conversation: StoredConversation): void {
  const all = loadConversations(userId);
  const idx = all.findIndex((c) => c.id === conversation.id);
  if (idx >= 0) {
    all[idx] = conversation;
  } else {
    all.unshift(conversation);
  }
  saveConversations(userId, all);
}

export function deleteConversation(userId: string, id: string): void {
  const all = loadConversations(userId).filter((c) => c.id !== id);
  saveConversations(userId, all);
}

export function loadActiveConversationId(userId: string): string | null {
  try {
    return localStorage.getItem(activeConversationKey(userId));
  } catch {
    return null;
  }
}

export function saveActiveConversationId(userId: string, id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(activeConversationKey(userId), id);
    } else {
      localStorage.removeItem(activeConversationKey(userId));
    }
  } catch {
    /* ignore */
  }
}

export function toggleBookmarkInStorage(messageId: string): void {
  void messageId;
}
