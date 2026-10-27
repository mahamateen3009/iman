import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { ageGroupFromAge } from '../types/profile';
import type { UserProfile } from '../types/profile';

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

  // Permanently deletes the signed-in user's auth account. Auth user
  // deletion requires the service role key, so it must run server-side.
  // We use the Supabase Auth Admin API via the user-delete edge function.
  const deleteAccount = useCallback(async (): Promise<{ error: string | null }> => {
    if (!session?.user) return { error: 'Not signed in.' };
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

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null, session: data.session };
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { error: null, session: data.session };
  }, []);

  const signOut = useCallback(async () => {
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
