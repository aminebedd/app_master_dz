import { notFound } from "next/navigation";
import { WorkCard } from "@/components/WorkCard";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categoryLabels, categoryOrder, work } from "@/lib/data";

// Home: three choices, nothing else.
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <section className="shell flex flex-col gap-10 py-12 md:gap-12 md:py-20">
      <h1 className="text-h2-sm font-semibold text-fg md:text-h2">{t.home.title}</h1>
      <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
        {categoryOrder.map((c) => {
          const items = work[c];
          const first = items[0];
          const count = c === "videos" ? t.category.videos(items.length) : t.category.projects(items.length);
          return (
            <WorkCard
              key={c}
              href={href(locale, `/${c}`)}
              title={categoryLabels[c][locale]}
              titleAs="h2"
              cover={first.cover}
              video={first.cover ? undefined : first.video}
              showPlay={false}
              sizes="(min-width: 768px) 384px, 100vw"
              meta={<span className="shrink-0 font-mono text-label uppercase text-fg-3">{count}</span>}
            />
          );
        })}
      </div>
    </section>
  );
}
