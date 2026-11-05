import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getVideo, work } from "@/lib/data";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => work.videos.map((v) => ({ locale, slug: v.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const v = getVideo(slug);
  return v && isLocale(locale) ? { title: v.title[locale] } : {};
}

// Full screen, nothing but the video and a way back.
export default async function WatchPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const v = getVideo(slug);
  if (!v?.video) notFound();
  const t = getDictionary(locale).watch;

  return (
    <main className="relative grid h-dvh place-items-center bg-canvas">
      <h1 className="sr-only">{v.title[locale]}</h1>
      <video
        src={v.video}
        controls
        autoPlay
        playsInline
        preload="auto"
        className="h-dvh w-full max-w-full object-contain"
      >
        {t.fallback}
      </video>
      <Link
        href={href(locale, "/videos")}
        aria-label={t.close}
        title={t.close}
        className="absolute top-4 start-4 grid size-11 place-items-center rounded-full bg-inverse/80 text-on-inverse transition-colors hover:bg-inverse"
      >
        <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M5 5l10 10M15 5L5 15" />
        </svg>
      </Link>
    </main>
  );
}
