import { prisma } from '@/lib/prisma';

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      category: true,
      images: { orderBy: { position: 'asc' } },
      variants: { orderBy: [{ color: 'asc' }, { size: 'asc' }] },
    },
  });
}

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;
