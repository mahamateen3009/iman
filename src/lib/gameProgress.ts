import { supabase } from './supabaseClient';
import type { GameProgress, TierId } from '../types/curriculum';

const emptyProgress = (tier: TierId): GameProgress => ({
  tier,
  completedLevels: [],
  unlockedRewards: [],
  currentLevel: 1,
});

export async function loadGameProgress(userId: string): Promise<GameProgress | null> {
  const { data, error } = await supabase
    .from('game_progress')
    .select('tier, completed_levels, unlocked_rewards, current_level')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    tier: data.tier as TierId,
    completedLevels: (data.completed_levels as string[]) ?? [],
    unlockedRewards: (data.unlocked_rewards as string[]) ?? [],
    currentLevel: data.current_level as number,
  };
}

export async function ensureGameProgress(userId: string, tier: TierId): Promise<GameProgress> {
  const existing = await loadGameProgress(userId);
  if (existing) return existing;

  const fresh = emptyProgress(tier);
  const { error } = await supabase.from('game_progress').insert({
    id: userId,
    tier: fresh.tier,
    completed_levels: fresh.completedLevels,
    unlocked_rewards: fresh.unlockedRewards,
    current_level: fresh.currentLevel,
  });
  if (error) {
    // May have been created concurrently; fall back to a read.
    const retry = await loadGameProgress(userId);
    return retry ?? fresh;
  }
  return fresh;
}

export async function saveGameProgress(userId: string, progress: GameProgress): Promise<void> {
  const { error } = await supabase
    .from('game_progress')
    .update({
      tier: progress.tier,
      completed_levels: progress.completedLevels,
      unlocked_rewards: progress.unlockedRewards,
      current_level: progress.currentLevel,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
  if (error) {
    console.error('[saveGameProgress]', error.message, { userId });
  }
}
