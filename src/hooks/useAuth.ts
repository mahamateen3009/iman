import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { ageGroupFromAge } from '../types/profile';
import type { UserProfile } from '../types/profile';
import {
  loadConversations,
  saveConversations,
  upsertConversation,
  type StoredConversation,
} from '../lib/storage';

/*
 * Local mock auth bypass for hackathon demo use.
 *
 * Supabase cloud auth is unreachable in this environment, so the sign-in /
 * sign-up handlers below short-circuit any email/password into a synthetic
 * session stored in localStorage. Profile data and conversations are also
 * kept locally so the rest of the app (profile setup, DOB gate, dashboard,
 * chat history) keeps working without a backend session.
 *
 * No UI components were changed — this hook exposes the same shape it did
 * before. The mock only swaps where the session/profile/conversations live.
 */

const MOCK_SESSION_KEY = 'iman_mock_session';
const MOCK_PROFILE_KEY = 'iman_mock_profile';
const MOCK_USER_ID = 'demo-user';

interface MockSession {
  user: User;
  access_token: string;
}

function buildMockSession(email: string): MockSession {
  return {
    user: {
      id: MOCK_USER_ID,
      app_metadata: { provider: 'mock' },
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email,
    } as unknown as User,
    access_token: 'mock-access-token',
  };
}

function sessionToSession(mock: MockSession): Session {
  return {
    access_token: mock.access_token,
    refresh_token: 'mock-refresh-token',
    expires_in: 60 * 60 * 24 * 30,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    token_type: 'bearer',
    user: mock.user,
  } as unknown as Session;
}

function loadMockSession(): MockSession | null {
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY);
    return raw ? (JSON.parse(raw) as MockSession) : null;
  } catch {
    return null;
  }
}

function persistMockSession(mock: MockSession | null) {
  try {
    if (mock) localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mock));
    else localStorage.removeItem(MOCK_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function loadMockProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(MOCK_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function persistMockProfile(profile: UserProfile | null) {
  try {
    if (profile) localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profile));
    else localStorage.removeItem(MOCK_PROFILE_KEY);
  } catch {
    /* ignore */
  }
}

export interface AuthState {
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
}

const PROFILE_COLUMNS = 'id, name, age, age_group, date_of_birth, gender, voice_pitch, voice_rate, created_at';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = useCallback(async (userId: string) => {
    setProfileLoading(true);
    const mock = loadMockSession();
    if (mock && userId === mock.user.id) {
      const localProfile = loadMockProfile();
      if (localProfile) setProfile(localProfile);
      setProfileLoading(false);
      return localProfile;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      setProfileLoading(false);
      return null;
    }
    setProfile(data as UserProfile | null);
    setProfileLoading(false);
    return data as UserProfile | null;
  }, []);

  const saveProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!session?.user) return;
      const profileUpdates = updates.age !== undefined
        ? { ...updates, age_group: ageGroupFromAge(updates.age) }
        : updates;

      const mock = loadMockSession();
      if (mock && session.user.id === mock.user.id) {
        const base: UserProfile = loadMockProfile() ?? {
          id: mock.user.id,
          name: '',
          age: null,
          age_group: null,
          date_of_birth: null,
          gender: null,
          voice_pitch: 1.0,
          voice_rate: 0.95,
        };
        const merged: UserProfile = {
          ...base,
          ...profileUpdates,
          id: mock.user.id,
        };
        persistMockProfile(merged);
        setProfile(merged);
        return merged;
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: session.user.id, ...profileUpdates, updated_at: new Date().toISOString() })
        .select(PROFILE_COLUMNS)
        .maybeSingle();

      if (error) return null;
      const updated = data as UserProfile | null;
      if (updated) setProfile(updated);
      return updated;
    },
    [session]
  );

  const deleteAccount = useCallback(async (): Promise<{ error: string | null }> => {
    if (!session?.user) return { error: 'Not signed in.' };
    const mock = loadMockSession();
    if (mock && session.user.id === mock.user.id) {
      persistMockSession(null);
      persistMockProfile(null);
      try {
        localStorage.removeItem('noor_conversations');
        localStorage.removeItem('noor_active_conversation');
      } catch {
        /* ignore */
      }
      setSession(null);
      setProfile(null);
      return { error: null };
    }

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { error: body?.error ?? `Request failed (${res.status}).` };
      }
      setSession(null);
      setProfile(null);
      return { error: null };
    } catch {
      return { error: 'Could not reach the deletion service. Try again.' };
    }
  }, [session]);

  useEffect(() => {
    const mock = loadMockSession();
    if (mock) {
      setSession(sessionToSession(mock));
      setLoading(false);
      const localProfile = loadMockProfile();
      if (localProfile) setProfile(localProfile);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session?.user) {
        void loadProfile(data.session.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
      if (newSession?.user) {
        void (async () => {
          await loadProfile(newSession.user.id);
        })();
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const startMockSession = useCallback((email: string) => {
    const mock = buildMockSession(email);
    persistMockSession(mock);
    setSession(sessionToSession(mock));
    const localProfile = loadMockProfile();
    if (localProfile) setProfile(localProfile);
    else setProfile(null);
  }, []);

  const signInWithEmail = useCallback(async (email: string, _password: string) => {
    startMockSession(email);
    return { error: null, session: sessionToSession(loadMockSession() as MockSession) };
  }, [startMockSession]);

  const signUpWithEmail = useCallback(async (email: string, _password: string) => {
    startMockSession(email);
    return { error: null, session: sessionToSession(loadMockSession() as MockSession) };
  }, [startMockSession]);

  const signOut = useCallback(async () => {
    const mock = loadMockSession();
    if (mock) {
      persistMockSession(null);
      setSession(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  return {
    session,
    profile,
    loading,
    profileLoading,
    loadProfile,
    saveProfile,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    deleteAccount,
  };
}

// Re-export mock-mode conversation helpers so the chat history keeps working
// in demo mode. These read/write localStorage instead of Supabase.
export const mockStorage = {
  loadConversations,
  saveConversations,
  upsertConversation,
  type: null as unknown as StoredConversation,
};
