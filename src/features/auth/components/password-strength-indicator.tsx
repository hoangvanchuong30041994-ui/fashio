'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { type Control, useWatch } from 'react-hook-form';
import {
  getPasswordStrength,
  getPasswordRequirements,
  STRENGTH_CONFIG,
} from '@/auth/utils/password-strength';
import type { RegisterInput } from '@/auth/schemas/register.schema';

const STRENGTH_SEGMENTS = [0, 1, 2] as const;

const STRENGTH_LABEL_KEYS = {
  'too-weak': 'common.passwordStrengthTooWeak',
  weak: 'common.passwordStrengthWeak',
  medium: 'common.passwordStrengthMedium',
  strong: 'common.passwordStrengthStrong',
} as const;

const REQUIREMENT_LABEL_KEYS: Record<string, string> = {
  minLength: 'common.passwordReqMinLength',
  uppercase: 'common.passwordReqUppercase',
  lowercase: 'common.passwordReqLowercase',
  number: 'common.passwordReqNumber',
  specialChar: 'common.passwordReqSpecialChar',
};

type PasswordStrengthIndicatorProps = {
  control: Control<RegisterInput>;
};

export function PasswordStrengthIndicator({ control }: PasswordStrengthIndicatorProps) {
  const t = useTranslations('Auth');

  const password = useWatch({ control, name: 'password' });

  const strength = useMemo(() => getPasswordStrength(password ?? ''), [password]);
  const requirements = useMemo(() => getPasswordRequirements(password ?? ''), [password]);

  if (!password) return null;

  return (
    <div className="mt-1.5 space-y-2">
      {strength && (
        <div className="space-y-1.5" aria-live="polite">
          <div className="flex gap-1">
            {STRENGTH_SEGMENTS.map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                  i < STRENGTH_CONFIG[strength].segments
                    ? STRENGTH_CONFIG[strength].color
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className={`text-xs font-medium ${STRENGTH_CONFIG[strength].textColor}`}>
            {t(STRENGTH_LABEL_KEYS[strength])}
          </p>
        </div>
      )}

      <ul className="space-y-1" aria-label={t('common.passwordRequirementsLabel')}>
        {requirements.map(({ key, met }) => (
          <li
            key={key}
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              met ? 'text-green-600' : 'text-muted-foreground'
            }`}
          >
            <span aria-hidden="true" className="text-[10px] font-bold">
              {met ? '✓' : '○'}
            </span>
            {t(REQUIREMENT_LABEL_KEYS[key] as Parameters<typeof t>[0])}
          </li>
        ))}
      </ul>
    </div>
  );
}
