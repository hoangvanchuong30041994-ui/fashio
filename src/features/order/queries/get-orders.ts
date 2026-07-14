import { getCurrentUser } from '@/auth/server/session';
import { prisma } from '@/lib/prisma';

export async function getOrders() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return [];
  }

  return prisma.order.findMany({
    where: { userId: currentUser.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      address: true,
    },
  });
}

export type OrderListItem = Awaited<ReturnType<typeof getOrders>>[number];
