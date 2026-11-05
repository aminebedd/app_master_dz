export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

/** Prefix an internal path with the locale: href("ar", "/portfolio") → "/ar/portfolio". */
export const href = (l: Locale, path: string) => `/${l}${path === "/" ? "" : path}`;

/** A string in every supported language. */
export type L<T = string> = Record<Locale, T>;
