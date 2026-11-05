"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

// Logo, language switch and theme toggle — nothing else.
export function Navbar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).nav;
  const pathname = usePathname();
  const other: Locale = locale === "en" ? "ar" : "en";
  const switchHref = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas">
      <nav className="shell flex h-16 items-center justify-between gap-4 md:h-20" aria-label={t.main}>
        <Logo locale={locale} />
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href={switchHref}
            hrefLang={other}
            lang={other}
            aria-label={t.otherLanguageLabel}
            className="grid h-10 place-items-center rounded-md border border-line-strong px-3 text-body-sm text-fg transition-colors hover:bg-raised"
          >
            {t.otherLanguage}
          </Link>
          <ThemeToggle labels={{ toLight: t.toLight, toDark: t.toDark }} />
        </div>
      </nav>
    </header>
  );
}
