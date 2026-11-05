import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkCard } from "@/components/WorkCard";
import { href, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categoryLabels, categoryOrder, isCategory, work } from "@/lib/data";

type Props = { params: Promise<{ locale: string; category: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => categoryOrder.map((category) => ({ locale, category })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale) || !isCategory(category)) return {};
  return { title: categoryLabels[category][locale] };
}

// One category: a grid of projects, each a picture and a name.
// Stores and platforms open the project itself, full screen; videos open the player.
export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  if (!isLocale(locale) || !isCategory(category)) notFound();
  const t = getDictionary(locale).category;
  const items = work[category];
  const isVideo = category === "videos";

  return (
    <section className="shell flex flex-col gap-10 py-12 md:gap-12 md:py-20">
      <div className="flex flex-col gap-4">
        <Link href={href(locale, "/")} className="group inline-flex w-fit items-center gap-2 text-body-sm text-fg-2 hover:text-fg">
          <span aria-hidden className="inline-block transition-transform group-hover:-translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:translate-x-0.5">
            ←
          </span>
          {t.back}
        </Link>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h1 className="text-h2-sm font-semibold text-fg md:text-h2">{categoryLabels[category][locale]}</h1>
          <span className="font-mono text-label uppercase text-fg-3">
            {isVideo ? t.videos(items.length) : t.projects(items.length)}
          </span>
        </div>
      </div>

      <div
        className={
          isVideo
            ? "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4"
            : "grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {items.map((w) => (
          <WorkCard
            key={w.slug}
            href={isVideo ? href(locale, `/watch/${w.slug}`) : w.href!}
            title={w.title[locale]}
            titleAs="h2"
            cover={w.cover}
            coverContain={w.coverContain}
            video={w.video}
            shape={isVideo ? "tall" : "wide"}
            sizes={isVideo ? "(min-width: 1024px) 282px, (min-width: 768px) 33vw, 50vw" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
