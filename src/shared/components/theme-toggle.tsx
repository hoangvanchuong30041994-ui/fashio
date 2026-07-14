'use client';

import * as React from 'react';
import { MoonIcon, Sun01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      disabled={!mounted}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex size-9 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-stone-600 transition hover:bg-stone-200 hover:text-stone-950 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
    >
      {isDark ? (
        <HugeiconsIcon icon={Sun01Icon} strokeWidth={2} className="size-4" />
      ) : (
        <HugeiconsIcon icon={MoonIcon} strokeWidth={2} className="size-4" />
      )}
    </button>
  );
}
