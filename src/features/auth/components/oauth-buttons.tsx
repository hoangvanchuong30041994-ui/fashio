'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { GoogleIcon } from '@/components/icons/google-icon';
import { GithubIcon } from '@/components/icons/github-icon';

type OAuthButtonsProps = {
  oauthLoading: string | null;
  isSubmitting: boolean;
  onGoogleLoginAction: () => void;
  onGithubLoginAction: () => void;
};

export function OAuthButtons({
  oauthLoading,
  isSubmitting,
  onGoogleLoginAction,
  onGithubLoginAction,
}: OAuthButtonsProps) {
  const t = useTranslations('Auth');

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full rounded-2xl text-sm font-medium"
        disabled={oauthLoading === 'google' || isSubmitting}
        onClick={onGoogleLoginAction}
      >
        {oauthLoading === 'google' ? (
          <Spinner />
        ) : (
          <>
            <GoogleIcon />
            {t('signIn.google')}
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full rounded-2xl text-sm font-medium"
        disabled={oauthLoading === 'github' || isSubmitting}
        onClick={onGithubLoginAction}
      >
        {oauthLoading === 'github' ? (
          <Spinner />
        ) : (
          <>
            <GithubIcon />
            {t('signIn.github')}
          </>
        )}
      </Button>
    </div>
  );
}
