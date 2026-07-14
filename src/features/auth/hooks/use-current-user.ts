'use client';

import { useSession } from '@/auth/hooks/use-session';

export function useCurrentUser() {
  const session = useSession();

  return {
    ...session,
    data: session.data?.user ?? null,
  };
}
