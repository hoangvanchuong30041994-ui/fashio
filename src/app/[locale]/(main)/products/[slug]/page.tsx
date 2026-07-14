import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProductBySlug } from '@/features/product/queries/get-product-by-slug';
import { ProductGallery } from '@/features/product/components/product-gallery';
import { ProductVariantSelector } from '@/features/product/components/product-variant-selector';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';

function formatCurrency(value: { toString(): string }, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value.toString()));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [product, t] = await Promise.all([
    getProductBySlug(slug),
    getTranslations({ locale, namespace: 'Product.detail' }),
  ]);

  if (!product) {
    notFound();
  }

  const totalStock = product.variants.reduce((total, variant) => total + variant.stock, 0);

  return (
    <main className="min-h-screen bg-[oklch(0.988_0.003_60)] text-stone-950 dark:bg-[oklch(0.115_0.01_285)] dark:text-white">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <ProductGallery product={product} />

        <div className="space-y-7 lg:sticky lg:top-8 lg:self-start">
          <Link
            href="/products"
            className="text-sm font-medium text-rose-500 transition hover:text-rose-600 dark:text-rose-300"
          >
            {t('backToProducts')}
          </Link>

          <div className="space-y-4">
            <Badge className="bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:text-rose-300">
              {product.category.name}
            </Badge>
            <div className="space-y-3">
              <h1 className="text-4xl leading-tight font-semibold sm:text-5xl">{product.name}</h1>
              {product.description ? (
                <p className="max-w-2xl text-base leading-8 text-stone-600 dark:text-white/70">
                  {product.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.75rem] border border-stone-200/80 bg-white/75 p-5 sm:grid-cols-3 dark:border-white/10 dark:bg-white/5">
            <div>
              <p className="text-xs tracking-[0.25em] text-stone-400 uppercase dark:text-white/40">
                {t('price')}
              </p>
              <p className="mt-2 text-xl font-semibold">
                {formatCurrency(product.basePrice, locale)}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] text-stone-400 uppercase dark:text-white/40">
                {t('stock')}
              </p>
              <p className="mt-2 text-xl font-semibold">{totalStock}</p>
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] text-stone-400 uppercase dark:text-white/40">
                {t('variants')}
              </p>
              <p className="mt-2 text-xl font-semibold">{product.variants.length}</p>
            </div>
          </div>

          <ProductVariantSelector
            locale={locale}
            variants={product.variants.map((variant) => ({
              id: variant.id,
              sku: variant.sku,
              size: variant.size,
              color: variant.color,
              price: variant.price.toString(),
              stock: variant.stock,
            }))}
            labels={{
              size: t('size'),
              color: t('color'),
              selected: t('selectedVariant'),
              stock: t('stockSuffix'),
              outOfStock: t('outOfStock'),
              comingSoon: t('comingSoon'),
              quantity: t('quantity'),
              addToCart: t('addToCart'),
              added: t('addedToCart'),
              viewCart: t('viewCart'),
              invalidVariant: t('invalidVariant'),
              unknownError: t('unknownError'),
            }}
          />

          <div className="rounded-[1.75rem] border border-dashed border-stone-300 p-5 text-sm leading-7 text-stone-500 dark:border-white/15 dark:text-white/60">
            {t('cartComingSoon')}
          </div>
        </div>
      </section>
    </main>
  );
}
