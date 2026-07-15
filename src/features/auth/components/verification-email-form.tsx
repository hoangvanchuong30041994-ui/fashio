'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { resendVerificationEmailAction } from '@/auth/actions/resend-verification-email';

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { Locale } from '@/i18n/routing';
import { AuthSubmitButton } from './auth-submit-button';

export function VerificationEmailForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Auth.verifyEmail');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent' | 'invalidEmail' | 'rateLimited' | 'error'>(
    'idle',
  );
  const [isPending, setIsPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setStatus('idle');

    try {
      const result = await resendVerificationEmailAction(locale, formData);

      if (result.ok) {
        setStatus('sent');
        setCooldown(60);
        return;
      }

      setStatus(
        result.code === 'invalidEmail'
          ? 'invalidEmail'
          : result.code === 'rateLimited'
            ? 'rateLimited'
            : 'error',
      );
    } catch {
      setStatus('error');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6" noValidate>
      <FieldGroup className="gap-5">
        <Field data-invalid={status === 'invalidEmail'} className="gap-2">
          <FieldLabel htmlFor="verification-email">{t('emailLabel')}</FieldLabel>
          <Input
            id="verification-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('emailPlaceholder')}
            className="h-12 px-4"
            aria-invalid={status === 'invalidEmail'}
            aria-describedby="verification-email-hint verification-email-feedback"
            required
          />
          <FieldDescription id="verification-email-hint">{t('resendHint')}</FieldDescription>
          {status === 'invalidEmail' ? <FieldError>{t('invalidEmail')}</FieldError> : null}
        </Field>
      </FieldGroup>

      <div id="verification-email-feedback" aria-live="polite">
        {status === 'sent' ? (
          <p
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-700"
            role="status"
          >
            {t('resendSuccess')}
          </p>
        ) : null}
        {status === 'rateLimited' ? <FieldError>{t('rateLimited')}</FieldError> : null}
        {status === 'error' ? <FieldError>{t('resendError')}</FieldError> : null}
      </div>

      <AuthSubmitButton
        isSubmitting={isPending}
        submittingLabel={t('resending')}
        submitLabel={cooldown > 0 ? t('resendIn', { seconds: cooldown }) : t('resend')}
        disabled={cooldown > 0}
      />

    </form>
  );
}
