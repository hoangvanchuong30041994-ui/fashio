import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getCart } from '@/features/cart/queries/get-cart';
import { CartItemRow } from '@/features/cart/components/cart-item-row';
import { CartSummary } from '@/features/cart/components/cart-summary';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Cart' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function CartPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [cart, t] = await Promise.all([getCart(), getTranslations({ locale, namespace: 'Cart' })]);
  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (total, item) => total + Number(item.variant.price.toString()) * item.quantity,
    0,
  );

  return (
    <main className="min-h-screen bg-[oklch(0.988_0.003_60)] text-stone-950 dark:bg-[oklch(0.115_0.01_285)] dark:text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <header className="space-y-4 rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-sm shadow-stone-950/5 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
          <Link
            href="/products"
            className="text-sm font-medium text-rose-500 transition hover:text-rose-600 dark:text-rose-300"
          >
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

        {items.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  locale={locale}
                  labels={{
                    quantity: t('quantity'),
                    update: t('update'),
                    remove: t('remove'),
                    stock: t('stock'),
                  }}
                />
              ))}
            </div>

            <CartSummary
              subtotal={subtotal}
              locale={locale}
              labels={{
                title: t('summary'),
                subtotal: t('subtotal'),
                shipping: t('shipping'),
                total: t('total'),
                checkout: t('checkout'),
                clear: t('clear'),
              }}
            />
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-white/60 px-6 py-16 text-center dark:border-white/15 dark:bg-white/5">
            <h2 className="text-2xl font-semibold">{t('emptyTitle')}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-500 dark:text-white/60">
              {t('emptyDescription')}
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-rose-100"
            >
              {t('shopProducts')}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
