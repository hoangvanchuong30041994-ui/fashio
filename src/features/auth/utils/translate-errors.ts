import type { AuthErrorCode } from '@/auth/constants/auth-error-codes';
import { useTranslations } from 'next-intl';

export function translateErrors(
  codes: AuthErrorCode[] | undefined,
  t: ReturnType<typeof useTranslations<'Auth.errors'>>,
) {
  if (!codes?.length) return [];
  return codes.map((code) => ({ message: t(code) }));
}
