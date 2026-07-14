export type PasswordStrength = 'too-weak' | 'weak' | 'medium' | 'strong';

export type StrengthConfig = {
  segments: number;
  color: string;
  textColor: string;
};

export type PasswordRequirement = {
  key: string;
  met: boolean;
};

export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()\-_=+[\]{};:'",./<>?\\|]/;

export const STRENGTH_CONFIG: Record<PasswordStrength, StrengthConfig> = {
  'too-weak': { segments: 1, color: 'bg-destructive', textColor: 'text-destructive' },
  weak: { segments: 1, color: 'bg-destructive', textColor: 'text-destructive' },
  medium: { segments: 2, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  strong: { segments: 3, color: 'bg-green-500', textColor: 'text-green-600' },
};

/**
 * Returns the met/unmet status for each password requirement.
 * Used by the requirements checklist UI.
 */
export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { key: 'minLength', met: password.length >= 8 },
    { key: 'uppercase', met: /[A-Z]/.test(password) },
    { key: 'lowercase', met: /[a-z]/.test(password) },
    { key: 'number', met: /[0-9]/.test(password) },
    { key: 'specialChar', met: SPECIAL_CHAR_REGEX.test(password) },
  ];
}

/**
 * Derives overall strength from the new rule-based requirements:
 * - Empty / < 8 chars      → too-weak
 * - 8+ chars, 0–1 criteria → weak
 * - 8+ chars, 2–3 criteria → medium
 * - 8+ chars, all 4 criteria → strong
 *
 * "criteria" = uppercase + lowercase + number + special char (4 total).
 */
export function getPasswordStrength(password: string): PasswordStrength | null {
  if (!password) return null;
  if (password.length < 8) return 'too-weak';

  const criteriaScore = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    SPECIAL_CHAR_REGEX.test(password),
  ].filter(Boolean).length;

  if (criteriaScore <= 1) return 'weak';
  if (criteriaScore <= 3) return 'medium';
  return 'strong';
}
