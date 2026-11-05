import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { dirOf, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Geist has no Arabic glyphs; Arabic pages lead with IBM Plex Sans Arabic (see globals.css).
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return {
    title: { default: t.title, template: "%s · App Master DZ" },
    description: t.description,
    alternates: { languages: { en: "/en", ar: "/ar" } },
  };
}

// Runs before paint so a saved light preference never flashes dark first.
const themeScript = `try{if(localStorage.getItem('theme')==='light'){document.documentElement.dataset.theme='light'}}catch(e){}`;

// Shell only: the navbar lives in (site)/layout.tsx so the full-screen video player has none.
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fonts = `${geistSans.variable} ${geistMono.variable} ${locale === "ar" ? plexArabic.variable : ""}`;

  return (
    <html lang={locale} dir={dirOf(locale)} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${fonts} flex min-h-dvh flex-col font-sans`}>{children}</body>
    </html>
  );
}
