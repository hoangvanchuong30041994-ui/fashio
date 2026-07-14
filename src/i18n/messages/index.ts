import type { AbstractIntlMessages } from 'next-intl';
import { routing, type Locale } from '../routing';
import en from './en';
import vi from './vi';

const messagesByLocale = {
  en,
  vi,
} satisfies Record<Locale, AbstractIntlMessages>;

function mergeMessages(
  fallback: AbstractIntlMessages,
  localeMessages: AbstractIntlMessages,
): AbstractIntlMessages {
  const merged: AbstractIntlMessages = { ...fallback };

  for (const namespace of Object.keys(localeMessages)) {
    const fallbackNamespace = fallback[namespace];
    const localeNamespace = localeMessages[namespace];

    if (
      fallbackNamespace &&
      localeNamespace &&
      typeof fallbackNamespace === 'object' &&
      typeof localeNamespace === 'object' &&
      !Array.isArray(fallbackNamespace) &&
      !Array.isArray(localeNamespace)
    ) {
      merged[namespace] = {
        ...(fallbackNamespace as Record<string, string>),
        ...(localeNamespace as Record<string, string>),
      };
    } else {
      merged[namespace] = localeNamespace;
    }
  }

  return merged;
}

export function getMessagesForLocale(locale: Locale): AbstractIntlMessages {
  const localeMessages = messagesByLocale[locale];

  if (locale === routing.defaultLocale) {
    return localeMessages;
  }

  return mergeMessages(messagesByLocale[routing.defaultLocale], localeMessages);
}

export type Messages = typeof en;
