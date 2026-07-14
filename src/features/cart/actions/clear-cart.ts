'use server';

import { revalidatePath } from 'next/cache';
import { getCart } from '@/features/cart/queries/get-cart';
import { prisma } from '@/lib/prisma';

export async function clearCartAction() {
  const cart = await getCart();

  if (!cart) {
    return;
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  revalidatePath('/', 'layout');
}
