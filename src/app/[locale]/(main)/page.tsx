import { getTranslations } from 'next-intl/server';
import { getCategories } from '@/features/product/queries/get-categories';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

type HomeProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const [tHero, tCard, tCol, tAbout, tFooter, categories] = await Promise.all([
    getTranslations({ locale, namespace: 'Hero' }),
    getTranslations({ locale, namespace: 'HeroCard' }),
    getTranslations({ locale, namespace: 'Collections' }),
    getTranslations({ locale, namespace: 'About' }),
    getTranslations({ locale, namespace: 'Footer' }),
    getCategories(),
  ]);

  const highlights = [tHero('highlight1'), tHero('highlight2'), tHero('highlight3')];

  const collections = categories.slice(0, 3);

  return (
    <main className="min-h-screen bg-[oklch(0.988_0.003_60)] text-stone-950 dark:bg-[oklch(0.115_0.01_285)] dark:text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-3 sm:gap-14 sm:px-6 sm:py-5 lg:gap-16 lg:px-10 lg:py-8">
        <section className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 sm:space-y-8">
            <p className="text-xs tracking-[0.28em] text-rose-500 uppercase sm:text-sm sm:tracking-[0.35em] dark:text-rose-300">
              {tHero('badge')}
            </p>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl">
                {tHero('title')}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8 dark:text-white/70">
                {tHero('description')}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/products"
                className="rounded-full bg-stone-950 px-6 py-3 text-center font-medium text-white transition hover:bg-stone-800 sm:w-auto dark:bg-white dark:text-stone-950 dark:hover:bg-rose-100"
              >
                {tHero('shopNow')}
              </Link>
              <a
                href="#about"
                className="rounded-full border border-stone-300 px-6 py-3 text-center font-medium transition hover:border-rose-300 hover:bg-rose-50 sm:w-auto dark:border-white/15 dark:hover:border-white/40 dark:hover:bg-white/5"
              >
                {tHero('viewLogbook')}
              </a>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3 sm:gap-4 sm:pt-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-600 sm:py-5 dark:border-white/10 dark:bg-white/5 dark:text-white/75"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-80 overflow-hidden rounded-[2rem] border border-rose-200/50 bg-linear-to-br from-stone-100 via-rose-100/70 to-stone-200 p-5 text-stone-950 shadow-2xl shadow-rose-900/8 sm:min-h-110 sm:rounded-4xl sm:p-8 lg:min-h-130 dark:border-white/10 dark:shadow-black/40">
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs tracking-[0.25em] text-stone-600 uppercase sm:text-sm sm:tracking-[0.3em]">
                  {tCard('season')}
                </p>
                <h2 className="max-w-sm text-2xl leading-tight font-semibold sm:text-3xl">
                  {tCard('subtitle')}
                </h2>
              </div>

              <div className="w-full rounded-[1.75rem] bg-stone-950 px-5 py-4 text-white shadow-lg sm:w-auto sm:self-end sm:rounded-4xl sm:px-6 sm:py-5">
                <p className="text-sm text-white/60">{tCard('bestSeller')}</p>
                <p className="mt-2 text-xl font-semibold sm:text-2xl">{tCard('productName')}</p>
                <p className="mt-1 text-sm text-white/70">{tCard('price')}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="collection" className="space-y-5 sm:space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="text-xs tracking-[0.25em] text-rose-500 uppercase sm:text-sm sm:tracking-[0.3em] dark:text-rose-300">
                {tCol('badge')}
              </p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{tCol('title')}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-stone-500 sm:text-base dark:text-white/65">
              {tCol('description')}
            </p>
          </div>

          {collections.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={{ pathname: '/collections/[slug]', params: { slug: collection.slug } }}
                  className="group block rounded-[1.5rem] border border-stone-200/80 bg-stone-50/80 p-4 transition hover:-translate-y-1 hover:bg-rose-50/60 sm:rounded-[1.75rem] sm:p-6 dark:border-white/8 dark:bg-white/4 dark:hover:bg-white/7"
                >
                  <div className="relative mb-5 flex h-40 items-end overflow-hidden rounded-[1.25rem] bg-linear-to-br from-stone-200 via-rose-100/50 to-stone-300 p-4 sm:mb-8 sm:h-52 sm:p-5 dark:from-stone-800 dark:via-stone-900 dark:to-[oklch(0.115_0.01_285)]">
                    {collection.image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${collection.image})` }}
                        aria-label={collection.name}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-linear-to-t from-stone-950/25 to-transparent" />
                    <span className="relative text-sm tracking-[0.3em] text-white/80 uppercase">
                      {tCol('productsCount', { count: collection._count.products })}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold sm:text-2xl">{collection.name}</h3>
                  {collection.description ? (
                    <p className="mt-2 text-sm leading-7 text-stone-500 sm:mt-3 sm:text-base dark:text-white/65">
                      {collection.description}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-[1.5rem] border border-dashed border-stone-300 px-6 py-10 text-center text-sm text-stone-500 dark:border-white/15 dark:text-white/60">
              {tCol('empty')}
            </p>
          )}
        </section>

        <section
          id="about"
          className="grid gap-5 rounded-[2rem] border border-stone-200/80 bg-stone-50/80 p-5 sm:gap-6 sm:rounded-4xl sm:p-8 lg:grid-cols-2 dark:border-white/8 dark:bg-white/4"
        >
          <div className="space-y-4">
            <p className="text-xs tracking-[0.25em] text-rose-500 uppercase sm:text-sm sm:tracking-[0.3em] dark:text-rose-300">
              {tAbout('badge')}
            </p>
            <h2 className="text-2xl leading-tight font-semibold sm:text-3xl">{tAbout('title')}</h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone-600 sm:text-base dark:text-white/70">
            <p>{tAbout('body1')}</p>
            <p>{tAbout('body2')}</p>
          </div>
        </section>

        <footer
          id="contact"
          className="flex flex-col gap-3 border-t border-stone-200/70 py-6 text-center text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between sm:py-8 sm:text-left dark:border-white/8 dark:text-white/50"
        >
          <p>{tFooter('copyright')}</p>
          <p>{tFooter('email')}</p>
        </footer>
      </section>
    </main>
  );
}
