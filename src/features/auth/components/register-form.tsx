'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signUpAction } from '@/auth/actions/sign-up';
import { loginWithGithub, loginWithGoogle } from '@/auth/client/auth-client';
import { AuthCardShell } from '@/auth/components/auth-card-shell';
import { AuthFieldError } from '@/auth/components/auth-field-error';
import { AuthFormError } from '@/auth/components/auth-form-error';
import { AuthFormFooter } from '@/auth/components/auth-form-footer';
import { PasswordStrengthIndicator } from '@/auth/components/password-strength-indicator';
import { PasswordVisibilityToggle } from '@/auth/components/password-visibility-toggle';
import { AUTH_ROUTES } from '@/auth/constants/auth-routes';
import { type AuthErrorCode } from '@/auth/constants/auth-error-codes';
import { useAuthFormSubmit } from '@/auth/hooks/use-auth-form-submit';
import { registerSchema, type RegisterInput } from '@/auth/schemas/register.schema';
import { createAuthFormData } from '@/auth/utils/create-auth-form-data';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Input } from '@/components/ui/input';
import type { Locale } from '@/i18n/routing';
import { AuthSubmitButton } from '@/auth/components/auth-submit-button';
import { AuthDivider } from '@/auth/components/auth-divider';
import { OAuthButtons } from '@/auth/components/oauth-buttons';

function getFieldErrorCode(message: string | undefined): AuthErrorCode | undefined {
  return message as AuthErrorCode | undefined;
}

export function RegisterForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Auth');
  const errorsT = useTranslations('Auth.errors');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const { formError, submit } = useAuthFormSubmit<RegisterInput>({
    locale,
    action: signUpAction,
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

  return (
    <AuthCardShell title={t('signUp.cardTitle')} description={t('signUp.cardDescription')}>
      <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
        <OAuthButtons
          oauthLoading={oauthLoading}
          isSubmitting={isSubmitting}
          onGoogleLogin={handleGoogleLogin}
          onGithubLogin={handleGithubLogin}
        />

        <AuthDivider label={t('signIn.divider')} />

        <FieldGroup className="gap-4">
          <Field data-invalid={!!errors.name}>
            <FieldLabel
              htmlFor="register-name"
              className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
            >
              {t('common.nameLabel')}
            </FieldLabel>
            <Input
              id="register-name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'register-name-error' : undefined}
              placeholder={t('common.namePlaceholder')}
              className="h-12 px-4 text-sm"
              {...register('name')}
            />
            <AuthFieldError code={getFieldErrorCode(errors.name?.message)} />
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel
              htmlFor="register-email"
              className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
            >
              {t('common.emailLabel')}
            </FieldLabel>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'register-email-error' : undefined}
              placeholder={t('common.emailPlaceholder')}
              className="h-12 px-4 text-sm"
              {...register('email')}
            />
            <AuthFieldError code={getFieldErrorCode(errors.email?.message)} />
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel
              htmlFor="register-password"
              className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
            >
              {t('common.passwordLabel')}
            </FieldLabel>
            <InputGroup className="h-12">
              <InputGroupInput
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'register-password-error' : undefined}
                placeholder={t('common.passwordPlaceholder')}
                className="px-4 text-sm"
                {...register('password')}
              />
              <InputGroupAddon align="inline-end">
                <PasswordVisibilityToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                  ariaLabelShow={t('common.showPassword')}
                  ariaLabelHide={t('common.hidePassword')}
                />
              </InputGroupAddon>
            </InputGroup>
            <AuthFieldError code={getFieldErrorCode(errors.password?.message)} />
            <PasswordStrengthIndicator control={control} />
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel
              htmlFor="register-confirm-password"
              className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
            >
              {t('common.confirmPasswordLabel')}
            </FieldLabel>
            <InputGroup className="h-12">
              <InputGroupInput
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? 'register-confirm-password-error' : undefined
                }
                placeholder={t('common.confirmPasswordPlaceholder')}
                className="px-4 text-sm"
                {...register('confirmPassword')}
              />
              <InputGroupAddon align="inline-end">
                <PasswordVisibilityToggle
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((v) => !v)}
                  ariaLabelShow={t('common.showPassword')}
                  ariaLabelHide={t('common.hidePassword')}
                />
              </InputGroupAddon>
            </InputGroup>
            <AuthFieldError code={getFieldErrorCode(errors.confirmPassword?.message)} />
          </Field>
        </FieldGroup>

        <AuthFormError message={formError ? errorsT(formError) : (oauthError ?? undefined)} />

        <AuthSubmitButton
          isSubmitting={isSubmitting}
          submittingLabel={t('signUp.submitting')}
          submitLabel={t('signUp.submit')}
        />

        <AuthDivider />

        <AuthFormFooter
          sctLabe={t('common.securityHint')}
          text={t('signUp.haveAccount')}
          ctaLabel={t('signUp.haveAccountCta')}
          href={AUTH_ROUTES.signIn}
        />
      </form>
    </AuthCardShell>
  );
}
