import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Database, FileCode2, Mail, BarChart3, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { engineeringExamples, fitRecommendations, gradeMultipliers, sizeRanges, toleranceWidth } from "@/lib/iso286";

const pages = {
  "tolerance-tables": {
    title: "Tolerance Tables",
    eyebrow: "ISO 286 data",
    description:
      "Browse ISO size steps, IT grade values, and the supported fundamental deviation symbols used by the calculator engine.",
    icon: Database,
  },
  "fit-charts": {
    title: "Fit Charts",
    eyebrow: "Engineering visualization",
    description:
      "Reference clearance, transition, and interference fit families with comparison ranges for common production selections.",
    icon: BarChart3,
  },
  examples: {
    title: "Engineering Examples",
    eyebrow: "Applications",
    description:
      "Typical fits for bearings, gearboxes, hydraulic assemblies, precision spindles, transmission shafts, and couplings.",
    icon: Building2,
  },
  guide: {
    title: "ISO 286 Guide",
    eyebrow: "Education",
    description:
      "A practical guide to ISO 286 notation, hole basis systems, shaft basis systems, IT grades, formulas, and GD&T relationships.",
    icon: BookOpen,
  },
  "api-docs": {
    title: "API Docs",
    eyebrow: "Developer interface",
    description:
      "Use the local JSON endpoint to integrate the ISO 286 calculation engine into inspection reports and internal tools.",
    icon: FileCode2,
  },
  about: {
    title: "About",
    eyebrow: "Engineering tool",
    description:
      "The fit calculator is designed as a precision manufacturing companion for design, process planning, inspection, and education.",
    icon: Building2,
  },
  contact: {
    title: "Contact",
    eyebrow: "Feedback",
    description:
      "Collect internal requests for new fit classes, validation datasets, CAD export, and inspection report templates.",
    icon: Mail,
  },
};

type SectionSlug = keyof typeof pages;

export function generateStaticParams() {
  return Object.keys(pages).map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const page = pages[section as SectionSlug];

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | ISO 286 Fit Tool`,
    description: page.description,
  };
}

export default async function FitToolSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const page = pages[section as SectionSlug];

  if (!page) {
    notFound();
  }

  const Icon = page.icon;

  return (
    <main className="min-h-screen bg-[#070b12] text-slate-100">
      <section className="border-b border-sky-300/20 bg-[linear-gradient(rgba(56,189,248,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.1)_1px,transparent_1px)] bg-[size:34px_34px]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <Link href="/fit-tool" className="inline-flex items-center gap-2 text-sm font-medium text-sky-200 hover:text-sky-100">
            <ArrowLeft className="h-4 w-4" />
            Back to calculator
          </Link>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
            <div>
              <Badge className="border border-sky-300/20 bg-sky-400/10 text-sky-200">{page.eyebrow}</Badge>
              <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-6xl">{page.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{page.description}</p>
            </div>
            <Card className="border-white/10 bg-white/[0.06] text-slate-100 backdrop-blur">
              <CardContent className="grid h-full place-items-center p-8">
                <div className="grid h-24 w-24 place-items-center rounded-md border border-sky-300/20 bg-sky-400/10 text-sky-200">
                  <Icon className="h-11 w-11" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {section === "tolerance-tables" && <ToleranceTablesContent />}
        {section === "fit-charts" && <FitChartsContent />}
        {section === "examples" && <ExamplesContent />}
        {section === "guide" && <GuideContent />}
        {section === "api-docs" && <ApiDocsContent />}
        {section === "about" && <PlainContent title="Professional scope" text="This module is built for engineers who need fast fit decisions, transparent formulas, and exportable values for drawings, supplier discussions, and inspection planning." />}
        {section === "contact" && <PlainContent title="Roadmap requests" text="Use this page as the future handoff point for validation data, company report branding, CAD exports, and internal API requirements." />}
      </section>
    </main>
  );
}

function ToleranceTablesContent() {
  return (
    <Card className="border-white/10 bg-white/[0.06] text-slate-100">
      <CardHeader>
        <CardTitle>IT Grade Matrix</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.14em] text-slate-400">
            <tr>
              <th className="border-b border-slate-700 px-3 py-3">Range</th>
              {Object.keys(gradeMultipliers).map((grade) => (
                <th key={grade} className="border-b border-slate-700 px-3 py-3">IT{grade}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeRanges.map((range) => {
              const mean = Math.sqrt((range.over || 1) * range.to);
              return (
                <tr key={`${range.over}-${range.to}`}>
                  <td className="border-b border-slate-800 px-3 py-3 text-slate-300">Over {range.over} to {range.to} mm</td>
                  {Object.keys(gradeMultipliers).map((grade) => (
                    <td key={grade} className="border-b border-slate-800 px-3 py-3 font-mono text-slate-100">{toleranceWidth(Number(grade), mean).toFixed(1)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function FitChartsContent() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {fitRecommendations.map((item) => (
        <Card key={`${item.holeClass}-${item.shaftClass}-${item.application}`} className="border-white/10 bg-white/[0.06] text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              <span>{item.application}</span>
              <span className="font-mono text-sky-200">{item.holeClass}/{item.shaftClass}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-300">{item.explanation}</p>
            <Badge className="mt-4 border border-sky-300/20 bg-sky-400/10 text-sky-200">{item.category}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ExamplesContent() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {engineeringExamples.map((example) => (
        <Card key={example.title} className="border-white/10 bg-white/[0.06] text-slate-100">
          <CardHeader>
            <CardTitle>{example.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sky-200">{example.fit}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{example.application}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{example.reason}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function GuideContent() {
  const items = [
    ["What is ISO 286", "A code system for limits and fits that defines tolerance grades and tolerance zone positions for linear sizes."],
    ["Hole basis system", "The H hole lower deviation is zero, so standard tooling can hold the hole at nominal while shaft zones set the fit behavior."],
    ["Shaft basis system", "The h shaft upper deviation is zero, useful when stock shafting or standard journals control the assembly basis."],
    ["IT grades", "International tolerance grades describe the tolerance width. Lower grade numbers represent tighter production capability."],
    ["GD&T relation", "Limits and fits size the mating features while GD&T controls form, orientation, location, and runout of those features."],
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map(([title, text]) => (
        <Card key={title} className="border-white/10 bg-white/[0.06] text-slate-100">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-300">{text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ApiDocsContent() {
  return (
    <Card className="border-white/10 bg-white/[0.06] text-slate-100">
      <CardHeader>
        <CardTitle>Calculation Endpoint</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-slate-300">Call the route handler with query parameters for nominal size, hole tolerance, shaft tolerance, and output unit.</p>
        <pre className="overflow-x-auto rounded-md border border-slate-700 bg-slate-950 p-4 text-sm text-sky-100">
          <code>{`GET /api/iso286?size=50&hole=H7&shaft=g6&unit=mm`}</code>
        </pre>
        <LinkButton href="/api/iso286?size=50&hole=H7&shaft=g6&unit=mm" variant="secondary" className="border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/20">
          Open sample API
        </LinkButton>
      </CardContent>
    </Card>
  );
}

function PlainContent({ title, text }: { title: string; text: string }) {
  return (
    <Card className="border-white/10 bg-white/[0.06] text-slate-100">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">{text}</p>
      </CardContent>
    </Card>
  );
}
