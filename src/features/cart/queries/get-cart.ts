import { getCurrentUser } from '@/auth/server/session';
import { prisma } from '@/lib/prisma';
import { getGuestId } from '@/features/cart/utils/cart-cookie';

export async function getCart() {
  const currentUser = await getCurrentUser();
  const guestId = currentUser ? null : await getGuestId();

  if (!currentUser && !guestId) {
    return null;
  }

  return prisma.cart.findFirst({
    where: currentUser ? { userId: currentUser.id } : { guestId },
    include: {
      items: {
        orderBy: { createdAt: 'asc' },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: { orderBy: { position: 'asc' }, take: 1 },
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export type CartWithItems = NonNullable<Awaited<ReturnType<typeof getCart>>>;
export type CartLineItem = CartWithItems['items'][number];
