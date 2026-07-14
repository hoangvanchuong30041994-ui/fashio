import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  pathnames: {
    '/': '/',
    '/sign-in': {
      vi: '/dang-nhap',
      en: '/sign-in',
    },
    '/sign-up': {
      vi: '/dang-ky',
      en: '/sign-up',
    },
    '/verify-email': {
      vi: '/xac-minh-email',
      en: '/verify-email',
    },
    '/products': {
      vi: '/san-pham',
      en: '/products',
    },
    '/cart': {
      vi: '/gio-hang',
      en: '/cart',
    },
    '/checkout': {
      vi: '/thanh-toan',
      en: '/checkout',
    },
    '/orders': {
      vi: '/don-hang',
      en: '/orders',
    },
    '/orders/[id]': {
      vi: '/don-hang/[id]',
      en: '/orders/[id]',
    },
    '/products/[slug]': {
      vi: '/san-pham/[slug]',
      en: '/products/[slug]',
    },
    '/collections/[slug]': {
      vi: '/bo-suu-tap/[slug]',
      en: '/collections/[slug]',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
