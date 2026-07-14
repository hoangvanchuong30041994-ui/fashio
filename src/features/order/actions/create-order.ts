'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from '@/i18n/navigation';
import { getCurrentUser } from '@/auth/server/session';
import { prisma } from '@/lib/prisma';
import type { Locale } from '@/i18n/routing';
import { checkoutSchema } from '@/features/order/schemas/checkout.schema';

export type CreateOrderState = {
  ok: boolean;
  code?: 'invalidInput' | 'emptyCart' | 'outOfStock' | 'unauthorized' | 'unknown';
};

export async function createOrderAction(
  locale: Locale,
  _prevState: CreateOrderState,
  formData: FormData,
): Promise<CreateOrderState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { ok: false, code: 'unauthorized' };
  }

  const parsed = checkoutSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    street: formData.get('street'),
    ward: formData.get('ward') || undefined,
    district: formData.get('district'),
    province: formData.get('province'),
    country: formData.get('country') || 'VN',
    note: formData.get('note') || undefined,
  });

  if (!parsed.success) {
    return { ok: false, code: 'invalidInput' };
  }

  let orderId: string;

  try {
    orderId = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: currentUser.id },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error('EMPTY_CART');
      }

      for (const item of cart.items) {
        if (!item.variant.product.isActive || item.variant.stock < item.quantity) {
          throw new Error('OUT_OF_STOCK');
        }
      }

      const total = cart.items.reduce(
        (sum, item) => sum + Number(item.variant.price.toString()) * item.quantity,
        0,
      );

      const address = await tx.address.create({
        data: {
          name: parsed.data.name,
          phone: parsed.data.phone,
          street: parsed.data.street,
          ward: parsed.data.ward || null,
          district: parsed.data.district,
          province: parsed.data.province,
          country: parsed.data.country,
          userId: currentUser.id,
        },
      });

      const order = await tx.order.create({
        data: {
          total: total.toFixed(2),
          note: parsed.data.note || null,
          userId: currentUser.id,
          addressId: address.id,
          items: {
            create: cart.items.map((item) => ({
              quantity: item.quantity,
              price: item.variant.price,
              variantId: item.variantId,
            })),
          },
        },
        select: { id: true },
      });

      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order.id;
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'EMPTY_CART') {
      return { ok: false, code: 'emptyCart' };
    }

    if (error instanceof Error && error.message === 'OUT_OF_STOCK') {
      return { ok: false, code: 'outOfStock' };
    }

    return { ok: false, code: 'unknown' };
  }

  revalidatePath('/', 'layout');
  redirect({ locale, href: { pathname: '/orders/[id]', params: { id: orderId } } });
  return { ok: true };
}
