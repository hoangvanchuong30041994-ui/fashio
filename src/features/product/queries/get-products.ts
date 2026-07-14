import { prisma } from '@/lib/prisma';

type GetProductsInput = {
  q?: string;
  category?: string;
};

export async function getProducts({ q, category }: GetProductsInput = {}) {
  const search = q?.trim();
  const categorySlug = category?.trim();

  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug
        ? {
            category: {
              slug: categorySlug,
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { tags: { has: search.toLowerCase() } },
            ],
          }
        : {}),
    },
    orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
    include: {
      category: true,
      images: { orderBy: { position: 'asc' } },
      variants: { orderBy: [{ color: 'asc' }, { size: 'asc' }] },
    },
  });
}

export type ProductListItem = Awaited<ReturnType<typeof getProducts>>[number];
