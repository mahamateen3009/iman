export type TierId = 1 | 2 | 3;

export interface CurriculumQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  acceptFreeText: boolean;
  requiredKeywords: string[];
}

export interface CurriculumLevel {
  id: string;
  tier: number;
  levelNumber: number;
  title: string;
  icon: string;
  storyText: string;
  questions: CurriculumQuestion[];
}

export interface CurriculumTier {
  id: number;
  name: string;
  ageMin: number;
  ageMax: number;
  levels: CurriculumLevel[];
}

export interface Curriculum {
  tiers: CurriculumTier[];
}

export interface GameProgress {
  tier: TierId;
  completedLevels: string[];
  unlockedRewards: string[];
  currentLevel: number;
}

export interface Reward {
  id: string;
  level: number;
  name: string;
  description: string;
}

export const REWARDS: Reward[] = [
  {
    id: 'wooden_shield',
    level: 10,
    name: 'Wooden Shield of Knowledge',
    description: 'Unlocked at Level 10 — a shield of the knowledge you have gathered so far.',
  },
  {
    id: 'bronze_sword',
    level: 20,
    name: 'Bronze Sword of Courage',
    description: 'Unlocked at Level 20 — the courage to stand for what is right.',
  },
  {
    id: 'golden_champion',
    level: 30,
    name: 'Golden Champion Shield & Sword of Light',
    description: 'Unlocked at Level 30 — the champion of your tier, ready to shine with the light of knowledge.',
  },
];

export function tierForAge(age: number | null | undefined): TierId {
  if (age == null) return 1;
  if (age <= 7) return 1;
  if (age <= 10) return 2;
  if (age <= 14) return 3;
  return 3;
}
