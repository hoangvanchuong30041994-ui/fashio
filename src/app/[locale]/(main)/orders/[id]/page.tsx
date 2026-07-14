import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { requireAuth } from '@/auth/server/require-auth';
import { getOrderById } from '@/features/order/queries/get-order-by-id';
import { OrderStatusBadge } from '@/features/order/components/order-status-badge';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

function formatCurrency(value: { toString(): string } | number, locale: string) {
  const amount = typeof value === 'number' ? value : Number(value.toString());
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(amount);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'Order.detail' });

  return {
    title: t('metaTitle', { id: id.slice(-8).toUpperCase() }),
    description: t('metaDescription'),
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  await requireAuth(locale);

  const [order, t] = await Promise.all([
    getOrderById(id),
    getTranslations({ locale, namespace: 'Order.detail' }),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[oklch(0.988_0.003_60)] text-stone-950 dark:bg-[oklch(0.115_0.01_285)] dark:text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <header className="space-y-4 rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-sm shadow-stone-950/5 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
          <Link href="/orders" className="text-sm font-medium text-rose-500 transition hover:text-rose-600 dark:text-rose-300">
            {t('backToOrders')}
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] text-rose-500 uppercase dark:text-rose-300">
                {t('badge')}
              </p>
              <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">
                #{order.id.slice(-8).toUpperCase()}
              </h1>
            </div>
            <OrderStatusBadge status={order.status} label={t(`status.${order.status}`)} />
          </div>
          <p className="text-sm text-stone-500 dark:text-white/60">
            {new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(order.createdAt)}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            {order.items.map((item) => {
              const product = item.variant.product;
              const image = product.images[0];
              return (
                <article key={item.id} className="grid gap-4 rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-4 sm:grid-cols-[7rem_1fr] dark:border-white/10 dark:bg-white/5">
                  <Link
                    href={{ pathname: '/products/[slug]', params: { slug: product.slug } }}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-linear-to-br from-stone-100 via-rose-100/70 to-stone-200 dark:from-stone-800 dark:via-stone-900 dark:to-stone-950"
                  >
                    {image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${image.url})` }}
                        aria-label={image.alt ?? product.name}
                      />
                    ) : null}
                  </Link>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Link
                        href={{ pathname: '/products/[slug]', params: { slug: product.slug } }}
                        className="font-semibold transition hover:text-rose-500 dark:hover:text-rose-300"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-2 text-sm text-stone-500 dark:text-white/60">
                        {item.quantity} × {[item.variant.color, item.variant.size].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(Number(item.price.toString()) * item.quantity, locale)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-5 rounded-[1.75rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm shadow-stone-950/5 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 lg:sticky lg:top-8">
            <h2 className="text-xl font-semibold">{t('summary')}</h2>
            <div className="space-y-2 text-sm text-stone-500 dark:text-white/60">
              <p className="font-medium text-stone-950 dark:text-white">{order.address.name}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.street}</p>
              <p>
                {[order.address.ward, order.address.district, order.address.province]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p>{order.address.country}</p>
            </div>
            {order.note ? (
              <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-600 dark:bg-white/5 dark:text-white/65">
                <p className="font-medium text-stone-950 dark:text-white">{t('note')}</p>
                <p className="mt-2">{order.note}</p>
              </div>
            ) : null}
            <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-base font-semibold dark:border-white/10">
              <span>{t('total')}</span>
              <span>{formatCurrency(order.total, locale)}</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
