import { cache } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/auth/server/auth';

export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}
