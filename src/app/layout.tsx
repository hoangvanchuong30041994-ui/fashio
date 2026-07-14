import { Geist, Geist_Mono, Figtree } from 'next/font/google';
import { headers } from 'next/headers';
import { cn } from '@/lib/utils';
import './globals.css';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Root layout — provides <html> and <body>.
// The locale is read from the header set by proxy.ts (next-intl middleware),
// so the lang attribute stays accurate for all locale routes.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const locale = headersList.get('x-next-intl-locale') ?? 'vi';

  return (
    <html
      lang={locale}
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        figtree.variable,
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
