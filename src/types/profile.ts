export interface UserProfile {
  id: string;
  name: string;
  age: number | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | null;
  voice_pitch: number;
  voice_rate: number;
  created_at?: string;
}

export type Gender = 'male' | 'female';

/**
 * Compute a person's age in whole years from a date-of-birth string.
 * Returns null when the input is missing or not a valid date. Used
 * everywhere the app needs "age" so it stays correct as years pass
 * without anyone updating a stored value.
 */
export function ageFromDateOfBirth(dob: string | null | undefined, today: Date = new Date()): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= 0 && age <= 140 ? age : null;
}
