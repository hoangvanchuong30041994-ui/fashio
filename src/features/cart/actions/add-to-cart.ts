'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/auth/server/session';
import { prisma } from '@/lib/prisma';
import { getOrCreateGuestId } from '@/features/cart/utils/cart-cookie';

export type AddToCartState = {
  ok: boolean;
  code?: 'added' | 'invalidVariant' | 'outOfStock' | 'unknown';
};

async function getOrCreateCart() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    const existing = await prisma.cart.findUnique({ where: { userId: currentUser.id } });

    if (existing) {
      return existing;
    }

    return prisma.cart.create({ data: { userId: currentUser.id } });
  }

  const guestId = await getOrCreateGuestId();
  const existing = await prisma.cart.findUnique({ where: { guestId } });

  if (existing) {
    return existing;
  }

  return prisma.cart.create({ data: { guestId } });
}

export async function addToCartAction(
  _locale: string,
  _prevState: AddToCartState,
  formData: FormData,
): Promise<AddToCartState> {
  const variantId = String(formData.get('variantId') ?? '');
  const quantity = Math.max(1, Number(formData.get('quantity') ?? 1));

  if (!variantId) {
    return { ok: false, code: 'invalidVariant' };
  }

  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant || !variant.product.isActive) {
      return { ok: false, code: 'invalidVariant' };
    }

    if (variant.stock <= 0) {
      return { ok: false, code: 'outOfStock' };
    }

    const cart = await getOrCreateCart();
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    const nextQuantity = Math.min((existingItem?.quantity ?? 0) + quantity, variant.stock);

    await prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
      update: { quantity: nextQuantity },
      create: {
        cartId: cart.id,
        variantId,
        quantity: nextQuantity,
      },
    });

    revalidatePath('/', 'layout');
    return { ok: true, code: 'added' };
  } catch {
    return { ok: false, code: 'unknown' };
  }
}
