'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signInAction } from '@/auth/actions/sign-in';
import { AuthCardShell } from '@/auth/components/auth-card-shell';
import { AuthFieldError } from '@/auth/components/auth-field-error';
import { AuthFormError } from '@/auth/components/auth-form-error';
import { AuthFormFooter } from '@/auth/components/auth-form-footer';
import { AUTH_ROUTES } from '@/auth/constants/auth-routes';
import { useAuthFormSubmit } from '@/auth/hooks/use-auth-form-submit';
import { loginSchema, type LoginInput } from '@/auth/schemas/login.schema';
import { createAuthFormData } from '@/auth/utils/create-auth-form-data';
import { type AuthErrorCode } from '@/auth/constants/auth-error-codes';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Input } from '@/components/ui/input';
import type { Locale } from '@/i18n/routing';
import { loginWithGoogle, loginWithGithub } from '@/auth/client/auth-client';
import { OAuthButtons } from '@/auth/components/oauth-buttons';
import { AuthDivider } from '@/auth/components/auth-divider';
import { AuthSubmitButton } from '@/auth/components/auth-submit-button';

type LoginFormProps = {
  verificationError?: 'TOKEN_EXPIRED' | 'INVALID_TOKEN';
};

export function LoginForm({ verificationError }: LoginFormProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('Auth');
  const errorsT = useTranslations('Auth.errors');
  const verifyEmailT = useTranslations('Auth.verifyEmail');

  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const [oauthError, setOauthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema as never),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const { formError, submit } = useAuthFormSubmit<LoginInput>({
    locale,
    action: signInAction,
    createFormDataAction: createAuthFormData,
    clearErrorsAction: clearErrors,
    setErrorAction: setError,
  });

  const handleGoogleLogin = async () => {
    setOauthLoading('google');
    setOauthError(null);
    try {
      await loginWithGoogle(locale);
    } catch {
      setOauthError(t('signIn.oauthError', { provider: 'Google' }));
      setOauthLoading(null);
    }
  };

  const handleGithubLogin = async () => {
    setOauthLoading('github');
    setOauthError(null);
    try {
      await loginWithGithub(locale);
    } catch {
      setOauthError(t('signIn.oauthError', { provider: 'GitHub' }));
      setOauthLoading(null);
    }
  };

  const verificationErrorMessage = verificationError
    ? verifyEmailT(verificationError === 'TOKEN_EXPIRED' ? 'expiredToken' : 'invalidToken')
    : undefined;

  return (
    <AuthCardShell title={t('signIn.cardTitle')} description={t('signIn.cardDescription')}>
      <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
        <OAuthButtons
          oauthLoading={oauthLoading}
          isSubmitting={isSubmitting}
          onGoogleLoginAction={handleGoogleLogin}
          onGithubLoginAction={handleGithubLogin}
        />

        <AuthDivider label={t('signIn.divider')} />

        <FieldGroup className="gap-4">
          <Field data-invalid={!!errors.email}>
            <FieldLabel
              htmlFor="login-email"
              className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
            >
              {t('common.emailLabel')}
            </FieldLabel>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              placeholder={t('common.emailPlaceholder')}
              className="h-12 px-4 text-sm"
              {...register('email')}
            />
            <AuthFieldError code={errors.email?.message as undefined | AuthErrorCode} />
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel
              htmlFor="login-password"
              className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
            >
              {t('common.passwordLabel')}
            </FieldLabel>
            <InputGroup className="h-12">
              <InputGroupInput
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                placeholder={t('common.passwordPlaceholder')}
                className="px-4 text-sm"
                {...register('password')}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-sm"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
                >
                  <HugeiconsIcon
                    icon={showPassword ? EyeOffIcon : EyeIcon}
                    strokeWidth={1.5}
                    className="size-4"
                  />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <AuthFieldError code={errors.password?.message as undefined | AuthErrorCode} />
          </Field>
        </FieldGroup>

        <AuthFormError
          message={formError ? errorsT(formError) : oauthError || verificationErrorMessage}
        />
        {formError === 'EMAIL_NOT_VERIFIED' || verificationError ? (
          <Link
            href={AUTH_ROUTES.verifyEmail}
            className="text-primary text-sm font-medium hover:underline"
          >
            {t('signIn.verifyEmailCta')}
          </Link>
        ) : null}

        <AuthSubmitButton
          isSubmitting={isSubmitting}
          submittingLabel={t('signIn.submitting')}
          submitLabel={t('signIn.submit')}
        />

        <AuthDivider />

        <AuthFormFooter
          sctLabe={t('common.securityHint')}
          text={t('signIn.noAccount')}
          ctaLabel={t('signIn.noAccountCta')}
          href={AUTH_ROUTES.signUp}
        />
      </form>
    </AuthCardShell>
  );
}
