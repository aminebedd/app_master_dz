// The work shown on the site, grouped in three categories.
// Each project is just a name, a cover image and where a click takes the visitor:
//   - stores    → the store itself, full screen (files in public/demos/, imported by scripts/import-work.cjs)
//   - platforms → the live product's own address
//   - videos    → a full-screen player page (/<locale>/watch/<slug>)

import type { L } from "@/i18n/config";

export type CategorySlug = "ecommerce" | "platforms" | "videos";

export type Work = {
  slug: string;
  title: L;
  /** Cover image (stores, platforms). Videos use a frame of the video instead. */
  cover?: string;
  /** Show the whole cover (tall phone screenshots) instead of cropping it. */
  coverContain?: boolean;
  /** Where a click goes. External links open in the same tab, like any other project. */
  href?: string;
  /** Video file, for the videos category. */
  video?: string;
};

export const categoryOrder: CategorySlug[] = ["ecommerce", "platforms", "videos"];

export const categoryLabels: Record<CategorySlug, L> = {
  ecommerce: { en: "E-commerce websites", ar: "مواقع التجارة الإلكترونية" },
  platforms: { en: "Business management platforms", ar: "منصّات إدارة الأعمال" },
  videos: { en: "Videos", ar: "الفيديوهات" },
};

const store = (slug: string, en: string, ar: string, cover = `/projects/${slug}/desktop.webp`): Work => ({
  slug,
  title: { en, ar },
  cover,
  href: `/demos/${slug}/index.html`,
});

const clip = (slug: string, file: string, en: string, ar: string): Work => ({
  slug,
  title: { en, ar },
  video: `/videos/${file}`,
});

export const work: Record<CategorySlug, Work[]> = {
  ecommerce: [
    store("aurenne", "Aurenne", "Aurenne"),
    store("ceel", "CeeL Store", "CeeL Store"),
    store("belbal", "Belbal Informatique", "Belbal Informatique", "/projects/belbal/desktop-2-home.webp"),
    store("mboutique", "M Boutique", "M Boutique"),
    store("walidcosmetique", "Walid Cosmétique", "وليد كوسميتيك"),
    store("arwashoes", "Arwa Shoes", "Arwa Shoes"),
    store("chicdemira", "Chic de Mira", "Chic de Mira"),
    store("hr", "Collection by HR", "Collection by HR"),
    store("adora", "Ad-Dourra DBK", "الدُّرّة DBK"),
    store("marlei", "Marlei Shop", "Marlei Shop"),
    store("izi", "iZi Lunettes", "iZi Lunettes"),
  ],
  platforms: [
    {
      slug: "excellence-school",
      title: { en: "ExcellenceSchool — school management", ar: "ExcellenceSchool — إدارة المدرسة" },
      cover: "/projects/excellence-school/admin-dashboard.webp",
      href: "https://excellenteschool.com/",
    },
  ],
  videos: [
    clip("showreel", "showreel.mp4", "Showreel", "الشوريل"),
    clip("abaya-clip", "abaya-clip.mp4", "Abaya — short", "العباية — نسخة قصيرة"),
    clip("canva-pro", "canva-pro.mp4", "Canva Pro offer", "عرض كانفا برو"),
    clip("claude-offer", "claude-offer.mp4", "Claude offer", "عرض Claude"),
    clip("stream-pro", "stream-pro.mp4", "Netflix + Shahid VIP", "نتفليكس + شاهد VIP"),
    clip("stream-offer", "stream-offer.mp4", "Netflix & Shahid — best price", "نتفليكس وشاهد — أحسن سعر"),
  ],
};

export const isCategory = (v: string): v is CategorySlug => (categoryOrder as string[]).includes(v);

export const getVideo = (slug: string) => work.videos.find((w) => w.slug === slug);
