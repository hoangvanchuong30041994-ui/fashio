import type { ReactNode } from 'react';

type AuthCardShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCardShell({ title, description, children }: AuthCardShellProps) {
  return (
    <div className="space-y-7">
      <div className="space-y-1.5">
        <h2 className="text-[1.65rem] font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </div>
  );
}
