'use client';

import { useTranslations } from 'next-intl';
import type { AuthErrorCode } from '@/auth/constants/auth-error-codes';
import { translateErrors } from '@/auth/utils/translate-errors';
import { FieldError } from '@/components/ui/field';

type AuthFieldErrorProps = {
  code?: AuthErrorCode;
};

export function AuthFieldError({ code }: AuthFieldErrorProps) {
  const errorsT = useTranslations('Auth.errors');

  if (!code) {
    return null;
  }

  return <FieldError errors={translateErrors([code], errorsT)} />;
}
