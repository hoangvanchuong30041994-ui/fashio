import type { ReactNode } from 'react';
import { ArrowLeft02Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link } from '@/i18n/navigation';

type AuthPageShellProps = {
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  homeLabel: string;
  trustBefore: string;
  trustCount: string;
  trustAfter: string;
  children: ReactNode;
};

export function AuthPageShell({
  badge,
  title,
  description,
  highlights,
  homeLabel,
  trustBefore,
  trustCount,
  trustAfter,
  children,
}: AuthPageShellProps) {
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[55%_45%]">
      <div className="dark bg-background relative hidden overflow-hidden lg:flex lg:flex-col lg:p-12">
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-160 w-160 rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.57 0.18 15 / 0.22) 0%, transparent 70%)',
            animation: 'auth-blob-a 14s ease-in-out infinite',
          }}
        />
        <div
          className="pointer-events-none absolute -right-32 -bottom-32 h-130 w-130 rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.68 0.16 5 / 0.16) 0%, transparent 70%)',
            animation: 'auth-blob-b 18s ease-in-out infinite',
          }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/3 h-90 w-90 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.45 0.16 10 / 0.12) 0%, transparent 70%)',
            animation: 'auth-blob-c 11s ease-in-out infinite',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.04)_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-56 bg-linear-to-t to-transparent" />
        <div className="relative z-10 flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-foreground/8 ring-foreground/10 flex h-9 w-9 items-center justify-center rounded-2xl ring-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground size-4"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-foreground text-xl font-semibold tracking-[0.2em] uppercase">
              FASHIO
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center py-16">
            <p className="text-muted-foreground/70 mb-5 text-xs font-medium tracking-[0.35em] uppercase">
              {badge}
            </p>
            <h1 className="text-foreground max-w-md text-4xl leading-[1.15] font-semibold tracking-tight xl:text-[2.75rem]">
              {title}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-sm text-[15px] leading-7">
              {description}
            </p>

            <ul className="mt-10 space-y-3.5">
              {highlights.map((item) => (
                <li key={item} className="text-foreground/75 flex items-center gap-3 text-sm">
                  <span className="bg-foreground/8 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      strokeWidth={2}
                      className="size-3 text-[oklch(0.68_0.16_5)]"
                    />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-foreground/8 border-t pt-6">
            <div className="flex items-center gap-3.5">
              <div className="flex -space-x-2">
                {['F', 'A', 'S', 'H'].map((l) => (
                  <div
                    key={l}
                    className="bg-foreground/10 ring-background text-foreground/50 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ring-2"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-sm">
                {trustBefore} <span className="text-foreground font-semibold">{trustCount}</span>{' '}
                {trustAfter}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div className="bg-background flex min-h-dvh flex-col">
        {/* Top nav */}
        <nav className="flex items-center p-5 sm:p-7">
          <Link
            href="/"
            className="group text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              strokeWidth={2}
              className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            />
            {homeLabel}
          </Link>
        </nav>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-10">
          <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-[both] w-full max-w-100 duration-500">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
