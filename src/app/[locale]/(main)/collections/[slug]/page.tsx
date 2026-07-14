import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getCategories } from '@/features/product/queries/get-categories';
import { getProducts } from '@/features/product/queries/get-products';
import { ProductGrid } from '@/features/product/components/product-grid';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'Product.collection' });

  return {
    title: t('metaTitle', { name: category.name }),
    description: category.description ?? t('metaDescription'),
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [t, categories, products] = await Promise.all([
    getTranslations({ locale, namespace: 'Product.collection' }),
    getCategories(),
    getProducts({ category: slug }),
  ]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[oklch(0.988_0.003_60)] text-stone-950 dark:bg-[oklch(0.115_0.01_285)] dark:text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <header className="space-y-4 rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-sm shadow-stone-950/5 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
          <Link
            href="/products"
            className="text-sm font-medium text-rose-500 transition hover:text-rose-600 dark:text-rose-300"
          >
            {t('backToProducts')}
          </Link>
          <div>
            <p className="text-xs tracking-[0.3em] text-rose-500 uppercase dark:text-rose-300">
              {t('badge')}
            </p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{category.name}</h1>
          </div>
          {category.description ? (
            <p className="max-w-2xl text-sm leading-7 text-stone-500 sm:text-base dark:text-white/65">
              {category.description}
            </p>
          ) : null}
        </header>

        <ProductGrid products={products} locale={locale} emptyLabel={t('empty')} />
      </section>
    </main>
  );
}
