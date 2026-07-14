import { Link } from '@/i18n/navigation';

type LogoProps = {
  label: string;
};

export function Logo({ label }: LogoProps) {
  return (
    <Link
      href="/"
      className="rounded-full px-2 text-lg font-semibold tracking-[0.24em] uppercase transition hover:text-rose-500 sm:text-2xl sm:tracking-[0.28em] dark:hover:text-rose-300"
    >
      {label}
    </Link>
  );
}
