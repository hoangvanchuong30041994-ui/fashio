import { z } from 'zod/v4';
import { AUTH_ERROR_CODES } from '@/auth/constants/auth-error-codes';

// ---------------------------------------------------------------------------
// Regex constants — defined once, shared across all auth schemas
// ---------------------------------------------------------------------------
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
// Allowed special characters: ! @ # $ % ^ & * ( ) - _ = + [ ] { } ; : ' " , . < > / ? \ |
const SPECIAL_CHARACTER_REGEX = /[!@#$%^&*()\-_=+[\]{};:'",./<>?\\|]/;

// ---------------------------------------------------------------------------
// Shared email schema
// .trim() runs first so "  user@example.com  " validates correctly
// ---------------------------------------------------------------------------
export const emailSchema = z
  .string()
  .trim()
  .min(1, AUTH_ERROR_CODES.invalidEmail)
  .email(AUTH_ERROR_CODES.invalidEmail)
  .max(254);

// ---------------------------------------------------------------------------
// Shared password schema
// No .trim(): passwords must be validated exactly as entered (NIST SP 800-63B)
// ---------------------------------------------------------------------------
export const passwordSchema = z
  .string()
  .min(8, AUTH_ERROR_CODES.passwordTooShort)
  .max(128, AUTH_ERROR_CODES.passwordTooLong)
  .regex(UPPERCASE_REGEX, AUTH_ERROR_CODES.passwordMissingUppercase)
  .regex(LOWERCASE_REGEX, AUTH_ERROR_CODES.passwordMissingLowercase)
  .regex(NUMBER_REGEX, AUTH_ERROR_CODES.passwordMissingNumber)
  .regex(SPECIAL_CHARACTER_REGEX, AUTH_ERROR_CODES.passwordMissingSpecialCharacter);
