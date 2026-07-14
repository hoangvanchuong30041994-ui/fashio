'use server';

import { revalidatePath } from 'next/cache';
import { getCart } from '@/features/cart/queries/get-cart';
import { prisma } from '@/lib/prisma';

export async function removeCartItemAction(_locale: string, formData: FormData) {
  const itemId = String(formData.get('itemId') ?? '');

  if (!itemId) {
    return;
  }

  const cart = await getCart();
  const item = cart?.items.find((cartItem) => cartItem.id === itemId);

  if (!item) {
    return;
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath('/', 'layout');
}
