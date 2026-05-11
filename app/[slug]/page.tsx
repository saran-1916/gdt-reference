import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGdtPage, gdtPages } from "@/lib/gdt-data";
import { SymbolPage } from "@/components/gdt/symbol-page";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return gdtPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getGdtPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.name} | GD&T Reference`,
    description: page.summary,
  };
}

export default async function GdtSymbolPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getGdtPage(slug);

  if (!page) {
    notFound();
  }

  return <SymbolPage page={page} />;
}
