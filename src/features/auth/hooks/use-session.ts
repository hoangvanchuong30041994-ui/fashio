'use client';

import { authClient } from '@/auth/client/auth-client';

export function useSession() {
  return authClient.useSession();
}
