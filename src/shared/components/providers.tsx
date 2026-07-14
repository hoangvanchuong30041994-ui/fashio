'use client';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ReactNode } from 'react';

// next-themes renders an inline <script> in a Client Component to prevent FOUC.
// React 19 warns about this pattern (scripts in components don't execute on client re-renders),
// but it is intentional and harmless — the script only needs to run once in the server HTML.
// This suppresses the noise until next-themes ships a React 19-compatible fix.
if (typeof window !== 'undefined') {
  const originalError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('script tag while rendering')) return;
    originalError(...args);
  };
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
