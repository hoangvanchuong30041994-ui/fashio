import { Link } from '@/i18n/navigation';

type AuthFormFooterProps = {
  text: string;
  ctaLabel: string;
  sctLabe: string;
  href: '/sign-in' | '/sign-up';
};

export function AuthFormFooter({ text, ctaLabel, sctLabe, href }: AuthFormFooterProps) {
  return (
    <>
      <p className="text-muted-foreground text-center text-sm">
        {text}{' '}
        <Link
          href={href}
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          {ctaLabel}
        </Link>
      </p>
      <p className="text-muted-foreground/60 text-center text-xs">{sctLabe}</p>
    </>
  );
}
