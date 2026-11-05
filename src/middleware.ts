import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

// Every page lives under /en or /ar. A path without a locale is redirected:
// to the visitor's saved choice, else Arabic if the browser prefers it, else English.
function pickLocale(req: NextRequest): Locale {
  const saved = req.cookies.get("locale")?.value;
  if (saved && isLocale(saved)) return saved;
  const accept = req.headers.get("accept-language") ?? "";
  const first = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("ar") ? "ar" : defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const seg = pathname.split("/")[1];
  if (seg && isLocale(seg)) {
    const res = NextResponse.next();
    res.cookies.set("locale", seg, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  }
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, static folders (demo stores, videos, screenshots, brand)
  // and any file with an extension.
  matcher: ["/((?!_next|api|demos|videos|projects|brand|.*\\..*).*)"],
};
