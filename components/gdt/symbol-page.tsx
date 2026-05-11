import Link from "next/link";
import { ArrowLeft, Box, CheckCircle2, Ruler } from "lucide-react";
import type { GdtPage } from "@/lib/gdt-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureControlFrame } from "@/components/gdt/feature-control-frame";
import { ToleranceScene } from "@/components/gdt/tolerance-scene";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SymbolPageProps = {
  page: GdtPage;
};

export function SymbolPage({ page }: SymbolPageProps) {
  const Drawing = page.Drawing;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            All symbols
          </Link>

          <header className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{page.category}</Badge>
                  <Badge className="bg-emerald-50 text-emerald-700">Datum: {page.relativeToDatum}</Badge>
                  <Badge className="bg-sky-50 text-sky-700">Modifiers: {page.materialModifiers}</Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase text-slate-500">GD&T Symbol Guide</p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-normal md:text-6xl">{page.name}</h1>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{page.summary}</p>
                </div>
              </div>
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-lg bg-slate-950 font-mono text-6xl text-white">
                {page.symbol}
              </div>
            </div>
            <FeatureControlFrame {...page.callout} />
          </header>

          <section id="definition" className="grid gap-4 md:grid-cols-2">
            <InfoBlock title="Definition" paragraphs={page.sections.definition} />
            <InfoBlock title="Application" paragraphs={page.sections.application} />
          </section>

          <section id="drawing" className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-start gap-3">
              <Ruler className="mt-1 h-5 w-5 text-emerald-600" />
              <div>
                <h2 className="text-2xl font-semibold tracking-normal">{page.drawingTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{page.drawingCaption}</p>
              </div>
            </div>
            <Drawing />
          </section>

          <section id="zone" className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Box className="h-5 w-5 text-emerald-600" />
                  <CardTitle>3D Tolerance Zone</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-slate-600">{page.toleranceZone}</p>
                <ToleranceScene type={page.scene} />
              </CardContent>
            </Card>
            <InfoBlock title="Inspection Method" paragraphs={page.sections.inspection} />
          </section>

          <section id="example" className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" />
              <div>
                <h2 className="text-2xl font-semibold tracking-normal">{page.example.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{page.example.problem}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {page.example.steps.map((step) => (
                <div key={step.label} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">{step.label}</p>
                  <p className="mt-2 font-mono text-sm text-slate-950">{step.value}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.note}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-md bg-emerald-50 p-4 text-sm font-medium leading-6 text-emerald-900">
              {page.example.result}
            </p>
          </section>

          <section id="compare" className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold tracking-normal">Comparison Table</h2>
            <div className="mt-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    {page.comparison.columns.map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {page.comparison.rows.map((row) => (
                    <TableRow key={row.join("-")}>
                      {row.map((cell, index) => (
                        <TableCell key={cell} className={index === 0 ? "font-medium" : ""}>
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <InfoBlock title="Notes" paragraphs={page.sections.notes} />
        </article>

        <aside className="hidden lg:block">
          <nav className="sticky top-6 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">On this page</p>
            {[
              ["Definition", "#definition"],
              ["Drawing", "#drawing"],
              ["3D Zone", "#zone"],
              ["Example", "#example"],
              ["Compare", "#compare"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="mt-3 block text-sm text-slate-600 hover:text-slate-950">
                {label}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </main>
  );
}

function InfoBlock({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-6 text-slate-600">
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
