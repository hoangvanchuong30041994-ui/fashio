import type { AuthErrorCode } from '@/auth/constants/auth-error-codes';

export type AuthFieldErrors = Record<string, AuthErrorCode[] | undefined>;

export type AuthActionState = {
  ok: boolean;
  formError?: AuthErrorCode;
  fieldErrors: AuthFieldErrors;
};

export const INITIAL_AUTH_ACTION_STATE: AuthActionState = {
  ok: false,
  formError: undefined,
  fieldErrors: {},
};
