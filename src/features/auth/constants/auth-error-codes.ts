export const AUTH_ERROR_CODES = {
  invalidEmail: 'INVALID_EMAIL',
  passwordTooShort: 'PASSWORD_TOO_SHORT',
  passwordTooLong: 'PASSWORD_TOO_LONG',
  passwordMissingUppercase: 'PASSWORD_MISSING_UPPERCASE',
  passwordMissingLowercase: 'PASSWORD_MISSING_LOWERCASE',
  passwordMissingNumber: 'PASSWORD_MISSING_NUMBER',
  passwordMissingSpecialCharacter: 'PASSWORD_MISSING_SPECIAL_CHARACTER',
  nameTooShort: 'NAME_TOO_SHORT',
  passwordMismatch: 'PASSWORD_MISMATCH',
  invalidCredentials: 'INVALID_CREDENTIALS',
  emailNotVerified: 'EMAIL_NOT_VERIFIED',
  tooManyAttempts: 'TOO_MANY_ATTEMPTS',
  unknown: 'UNKNOWN_ERROR',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];
