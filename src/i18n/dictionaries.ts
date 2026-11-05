import type { Locale } from "./config";

const en = {
  nav: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    otherLanguage: "العربية",
    otherLanguageLabel: "Switch to Arabic",
    main: "Main",
    home: "App Master DZ — home",
  },
  home: {
    title: "Choose what you want to see",
  },
  category: {
    back: "All categories",
    projects: (n: number) => (n === 1 ? "1 project" : `${n} projects`),
    videos: (n: number) => (n === 1 ? "1 video" : `${n} videos`),
  },
  watch: {
    close: "Back to videos",
    fallback: "Your browser can’t play this video.",
  },
  notFound: {
    title: "This page doesn’t exist.",
    cta: "Back to home",
  },
  meta: {
    title: "App Master DZ — Stores, platforms & video",
    description: "Our work: e-commerce websites, business management platforms and videos.",
  },
};

export type Dictionary = typeof en;

const ar: Dictionary = {
  nav: {
    toLight: "التبديل إلى الوضع الفاتح",
    toDark: "التبديل إلى الوضع الداكن",
    otherLanguage: "English",
    otherLanguageLabel: "Switch to English",
    main: "القائمة الرئيسية",
    home: "App Master DZ — الصفحة الرئيسية",
  },
  home: {
    title: "اختر ماذا تريد أن تشاهد",
  },
  category: {
    back: "كل الأقسام",
    // Arabic counted nouns: 1 / 2 have their own forms, 3–10 take the plural, 11+ the singular.
    projects: (n: number) =>
      n === 1 ? "مشروع واحد" : n === 2 ? "مشروعان" : n <= 10 ? `${n} مشاريع` : `${n} مشروعاً`,
    videos: (n: number) =>
      n === 1 ? "فيديو واحد" : n === 2 ? "فيديوهان" : n <= 10 ? `${n} فيديوهات` : `${n} فيديو`,
  },
  watch: {
    close: "العودة إلى الفيديوهات",
    fallback: "متصفحك لا يستطيع تشغيل هذا الفيديو.",
  },
  notFound: {
    title: "هذه الصفحة غير موجودة.",
    cta: "العودة إلى الرئيسية",
  },
  meta: {
    title: "App Master DZ — متاجر، منصّات وفيديو",
    description: "أعمالنا: مواقع تجارة إلكترونية، منصّات إدارة الأعمال، وفيديوهات.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, ar };
export const getDictionary = (l: Locale) => dictionaries[l];
