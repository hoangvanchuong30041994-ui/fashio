import { cookies } from 'next/headers';

export const CART_GUEST_ID_COOKIE = 'fashio_guest_id';
const MAX_AGE = 60 * 60 * 24 * 30;

export async function getGuestId() {
  const cookieStore = await cookies();
  return cookieStore.get(CART_GUEST_ID_COOKIE)?.value ?? null;
}

export async function getOrCreateGuestId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_GUEST_ID_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const guestId = crypto.randomUUID();
  cookieStore.set(CART_GUEST_ID_COOKIE, guestId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });

  return guestId;
}
