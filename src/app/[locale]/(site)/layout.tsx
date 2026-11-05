import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { isLocale } from "@/i18n/config";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <Navbar locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
    </>
  );
}
