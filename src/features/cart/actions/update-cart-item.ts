'use server';

import { revalidatePath } from 'next/cache';
import { getCart } from '@/features/cart/queries/get-cart';
import { prisma } from '@/lib/prisma';

async function assertCartItem(itemId: string) {
  const cart = await getCart();

  if (!cart) {
    return null;
  }

  return cart.items.find((item) => item.id === itemId) ?? null;
}

export async function updateCartItemAction(_locale: string, formData: FormData) {
  const itemId = String(formData.get('itemId') ?? '');
  const quantity = Number(formData.get('quantity') ?? 1);

  if (!itemId) {
    return;
  }

  const item = await assertCartItem(itemId);

  if (!item) {
    return;
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: Math.min(Math.max(1, quantity), item.variant.stock) },
    });
  }

  revalidatePath('/', 'layout');
}
