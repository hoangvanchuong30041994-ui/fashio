import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { requireAuth } from '@/auth/server/require-auth';
import { getOrders } from '@/features/order/queries/get-orders';
import { OrderStatusBadge } from '@/features/order/components/order-status-badge';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

function formatCurrency(value: { toString(): string }, locale: string) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(
    Number(value.toString()),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Order.list' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function OrdersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  await requireAuth(locale);

  const [orders, t] = await Promise.all([
    getOrders(),
    getTranslations({ locale, namespace: 'Order.list' }),
  ]);

  return (
    <main className="min-h-screen bg-[oklch(0.988_0.003_60)] text-stone-950 dark:bg-[oklch(0.115_0.01_285)] dark:text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <header className="space-y-4 rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-sm shadow-stone-950/5 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
          <Link href="/products" className="text-sm font-medium text-rose-500 transition hover:text-rose-600 dark:text-rose-300">
            {t('continueShopping')}
          </Link>
          <div>
            <p className="text-xs tracking-[0.3em] text-rose-500 uppercase dark:text-rose-300">
              {t('badge')}
            </p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{t('title')}</h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-stone-500 sm:text-base dark:text-white/65">
            {t('description')}
          </p>
        </header>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={{ pathname: '/orders/[id]', params: { id: order.id } }}
                className="grid gap-4 rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-950/10 sm:grid-cols-[1fr_auto] dark:border-white/10 dark:bg-white/5 dark:hover:shadow-black/20"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold">#{order.id.slice(-8).toUpperCase()}</h2>
                    <OrderStatusBadge status={order.status} label={t(`status.${order.status}`)} />
                  </div>
                  <p className="text-sm text-stone-500 dark:text-white/60">
                    {new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(order.createdAt)}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-white/60">
                    {t('itemCount', { count: order.items.length })}
                  </p>
                </div>
                <p className="text-xl font-semibold">{formatCurrency(order.total, locale)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-white/60 px-6 py-16 text-center dark:border-white/15 dark:bg-white/5">
            <h2 className="text-2xl font-semibold">{t('emptyTitle')}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-500 dark:text-white/60">
              {t('emptyDescription')}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
