import type { ReactNode } from 'react';

type AppShellProps = {
  header: ReactNode;
  children: ReactNode;
};

export function AppShell({ header, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[oklch(0.988_0.003_60)] text-stone-950 dark:bg-[oklch(0.115_0.01_285)] dark:text-white">
      {header}
      {children}
    </div>
  );
}
