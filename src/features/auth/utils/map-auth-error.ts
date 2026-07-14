import { APIError } from 'better-auth';
import { AUTH_ERROR_CODES } from '@/auth/constants/auth-error-codes';

export function isExistingAccountError(error: unknown): boolean {
  if (!(error instanceof APIError)) return false;

  const code = error.body?.code;
  return code === 'USER_ALREADY_EXISTS' || code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL';
}

export function mapAuthError(error: unknown) {
  if (!(error instanceof APIError)) return AUTH_ERROR_CODES.unknown;

  const code = error.body?.code;
  const statusCode = error.statusCode;

  // sign-in: UNAUTHORIZED (401) with INVALID_EMAIL_OR_PASSWORD
  if (code === 'INVALID_EMAIL_OR_PASSWORD' || statusCode === 401) {
    return AUTH_ERROR_CODES.invalidCredentials;
  }

  if (code === 'EMAIL_NOT_VERIFIED') {
    return AUTH_ERROR_CODES.emailNotVerified;
  }



  return AUTH_ERROR_CODES.unknown;
}
