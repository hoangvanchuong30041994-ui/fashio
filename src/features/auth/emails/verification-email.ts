import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

type VerificationEmailTemplateInput = {
  locale: Locale;
  url: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };

    return entities[character];
  });
}

export async function createVerificationEmailTemplate({
  locale,
  url,
}: VerificationEmailTemplateInput) {
  const t = await getTranslations({ locale, namespace: 'Auth.verifyEmail.email' });
  const escapedUrl = escapeHtml(url);

  return {
    subject: t('subject'),
    text: [
      t('greeting'),
      t('intro'),
      t('stepsTitle'),
      `• ${t('stepOne')}`,
      `• ${t('stepTwo')}`,
      `${t('actionLabel')}: ${url}`,
      t('expiry'),
      t('securityNotice'),
      t('ignoreNotice'),
    ].join('\n\n'),
    html: `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin: 0; padding: 0; background-color: #f6f5f3; color: #292524; font-family: Arial, Helvetica, sans-serif;">
    <span style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">${t('preheader')}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f6f5f3;">
      <tr>
        <td align="center" style="padding: 40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px;">
            <tr>
              <td style="padding: 0 24px 18px; color: #1c1917; font-size: 18px; font-weight: 700; letter-spacing: 0.2em;">FASHIO</td>
            </tr>
            <tr>
              <td style="overflow: hidden; border: 1px solid #e7e5e4; border-radius: 20px; background-color: #ffffff;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 40px 36px 32px;">
                      <p style="margin: 0 0 12px; color: #78716c; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">${t('eyebrow')}</p>
                      <h1 style="margin: 0 0 20px; color: #1c1917; font-size: 28px; line-height: 1.25;">${t('heading')}</h1>
                      <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6;">${t('greeting')}</p>
                      <p style="margin: 0; color: #57534e; font-size: 16px; line-height: 1.6;">${t('intro')}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 36px 28px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius: 12px; background-color: #fafaf9;">
                        <tr>
                          <td style="padding: 20px 22px;">
                            <p style="margin: 0 0 10px; color: #1c1917; font-size: 14px; font-weight: 700;">${t('stepsTitle')}</p>
                            <p style="margin: 0 0 6px; color: #57534e; font-size: 14px; line-height: 1.5;">1. ${t('stepOne')}</p>
                            <p style="margin: 0; color: #57534e; font-size: 14px; line-height: 1.5;">2. ${t('stepTwo')}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 0 36px 28px;">
                      <a href="${escapedUrl}" style="display: inline-block; border-radius: 9999px; background-color: #1c1917; padding: 14px 24px; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none;">${t('actionLabel')}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 36px 32px;">
                      <p style="margin: 0 0 12px; color: #57534e; font-size: 14px; line-height: 1.6;">${t('expiry')}</p>
                      <p style="margin: 0; color: #78716c; font-size: 13px; line-height: 1.6;">${t('securityNotice')}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 24px 0;">
                <p style="margin: 0 0 10px; color: #78716c; font-size: 12px; line-height: 1.5;">${t('fallbackLabel')}</p>
                <p style="margin: 0; word-break: break-all; color: #57534e; font-size: 12px; line-height: 1.5;">${escapedUrl}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px;">
                <p style="margin: 0; color: #78716c; font-size: 12px; line-height: 1.5;">${t('ignoreNotice')}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}
