"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/Button";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// not-found pages don't receive params, so the locale is read from the URL.
export default function NotFound() {
  const seg = usePathname().split("/")[1] ?? "";
  const locale = isLocale(seg) ? seg : "en";
  const t = getDictionary(locale).notFound;
  return (
    <main className="shell flex flex-1 flex-col items-start justify-center gap-6 py-24">
      <p className="font-mono text-label uppercase text-fg-3">404</p>
      <h1 className="text-h1-sm font-semibold text-fg md:text-h1">{t.title}</h1>
      <Button href={href(locale, "/")} arrow>
        {t.cta}
      </Button>
    </main>
  );
}
