import { Resend } from 'resend';
import { createVerificationEmailTemplate } from '@/auth/emails/verification-email';
import type { Locale } from '@/i18n/routing';

type SendVerificationEmailInput = {
  to: string;
  url: string;
  locale: Locale;
};

export async function sendVerificationEmail({
  to,
  url,
  locale,
}: SendVerificationEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error('Email delivery is not configured.');
  }

  const email = await createVerificationEmailTemplate({ locale, url });
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    ...email,
  });

  if (error) {
    console.error('Resend verification email delivery failed.', {
      code: error.name,
      statusCode: error.statusCode,
      message: error.message,
    });
    throw new Error('Failed to send verification email.');
  }
}
