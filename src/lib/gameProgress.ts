import type { GameProgress, TierId } from '../types/curriculum';

const progressKey = (userId: string) => `iman_game_progress_${userId}`;

const emptyProgress = (tier: TierId): GameProgress => ({
  tier,
  completedLevels: [],
  unlockedRewards: [],
  currentLevel: 1,
});

export async function loadGameProgress(userId: string): Promise<GameProgress | null> {
  try {
    const raw = localStorage.getItem(progressKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as GameProgress;
  } catch {
    return null;
  }
}

export async function ensureGameProgress(userId: string, tier: TierId): Promise<GameProgress> {
  const existing = await loadGameProgress(userId);
  if (existing) return existing;

  const fresh = emptyProgress(tier);
  try {
    localStorage.setItem(progressKey(userId), JSON.stringify(fresh));
  } catch {
    /* ignore */
  }
  return fresh;
}

export async function saveGameProgress(userId: string, progress: GameProgress): Promise<void> {
  try {
    localStorage.setItem(progressKey(userId), JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}
