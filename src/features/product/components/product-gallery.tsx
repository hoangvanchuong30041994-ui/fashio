import type { ProductDetail } from '@/features/product/queries/get-product-by-slug';

export function ProductGallery({ product }: { product: ProductDetail }) {
  const images =
    product.images.length > 0
      ? product.images
      : [{ id: 'placeholder', url: '', alt: product.name }];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative aspect-4/5 overflow-hidden rounded-[2rem] border border-stone-200/80 bg-linear-to-br from-stone-100 via-rose-100/70 to-stone-200 dark:border-white/10 dark:from-stone-800 dark:via-stone-900 dark:to-stone-950"
        >
          {image.url ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image.url})` }}
              aria-label={image.alt ?? `${product.name} image ${index + 1}`}
            />
          ) : null}
          <div className="absolute bottom-5 left-5 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-stone-700 backdrop-blur dark:bg-stone-950/70 dark:text-white/80">
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>
      ))}
    </div>
  );
}
