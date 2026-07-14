import { getCurrentUser } from '@/auth/server/session';
import { prisma } from '@/lib/prisma';

export async function getOrderById(id: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return prisma.order.findFirst({
    where: {
      id,
      userId: currentUser.id,
    },
    include: {
      address: true,
      items: {
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

export type OrderDetail = NonNullable<Awaited<ReturnType<typeof getOrderById>>>;
