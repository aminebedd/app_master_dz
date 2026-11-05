import Image from "next/image";
import Link from "next/link";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// Official badge (public/brand/logo-original.webp), cropped to its circle so it sits on either theme.
export function Logo({ locale }: { locale: Locale }) {
  return (
    <Link
      href={href(locale, "/")}
      className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap"
      aria-label={getDictionary(locale).nav.home}
    >
      <Image src="/brand/logo-96.png" alt="" width={40} height={40} className="size-10 rounded-full" priority />
      {/* Brand name stays in Latin script and left-to-right in both languages. */}
      <span dir="ltr" className="flex items-baseline gap-1 font-latin">
        <span className="text-h4 font-semibold text-fg">AppMaster</span>
        <span className="text-h4 font-semibold text-fg-2">DZ</span>
      </span>
    </Link>
  );
}
