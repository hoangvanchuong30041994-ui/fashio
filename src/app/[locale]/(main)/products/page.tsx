import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getCategories } from '@/features/product/queries/get-categories';
import { getProducts } from '@/features/product/queries/get-products';
import { ProductGrid } from '@/features/product/components/product-grid';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Product.list' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { q, category } = await searchParams;
  const [t, products, categories] = await Promise.all([
    getTranslations({ locale, namespace: 'Product.list' }),
    getProducts({ q, category }),
    getCategories(),
  ]);

  const selectedCategory = categories.find((item) => item.slug === category);

  return (
    <main className="min-h-screen bg-[oklch(0.988_0.003_60)] text-stone-950 dark:bg-[oklch(0.115_0.01_285)] dark:text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <header className="space-y-5 rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-sm shadow-stone-950/5 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Link
                href="/"
                className="text-sm font-medium text-rose-500 transition hover:text-rose-600 dark:text-rose-300"
              >
                {t('backHome')}
              </Link>
              <div>
                <p className="text-xs tracking-[0.3em] text-rose-500 uppercase dark:text-rose-300">
                  {t('badge')}
                </p>
                <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">
                  {selectedCategory ? selectedCategory.name : t('title')}
                </h1>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-stone-500 sm:text-base dark:text-white/65">
                {selectedCategory?.description ?? t('description')}
              </p>
            </div>

            <form className="flex w-full flex-col gap-2 sm:flex-row md:max-w-md" action="" method="get">
              {category ? <input type="hidden" name="category" value={category} /> : null}
              <Input
                name="q"
                defaultValue={q}
                placeholder={t('searchPlaceholder')}
                className="h-11 rounded-full bg-white/80 px-4 dark:bg-white/10"
              />
              <Button type="submit" className="h-11 rounded-full px-6">
                {t('search')}
              </Button>
            </form>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-rose-300 hover:text-rose-500 dark:border-white/10 dark:bg-white/5 dark:hover:text-rose-300"
            >
              {t('allCategories')}
            </Link>
            {categories.map((item) => (
              <Link
                key={item.id}
                href={{ pathname: '/products', query: { category: item.slug, ...(q ? { q } : {}) } }}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-rose-300 hover:text-rose-500 dark:border-white/10 dark:bg-white/5 dark:hover:text-rose-300"
              >
                {item.name} ({item._count.products})
              </Link>
            ))}
          </nav>
        </header>

        <div className="flex items-center justify-between text-sm text-stone-500 dark:text-white/60">
          <p>{t('resultCount', { count: products.length })}</p>
          {q || category ? (
            <Link href="/products" className="font-medium text-rose-500 hover:text-rose-600 dark:text-rose-300">
              {t('clearFilters')}
            </Link>
          ) : null}
        </div>

        <ProductGrid products={products} locale={locale} emptyLabel={t('empty')} />
      </section>
    </main>
  );
}
