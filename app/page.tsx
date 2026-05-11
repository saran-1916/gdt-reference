import { BookOpen, Box, TableProperties } from "lucide-react";
import { SearchableSymbols } from "@/components/gdt/searchable-symbols";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[1fr_420px] lg:py-14">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-50 text-emerald-700">Next.js reference app</Badge>
              <Badge className="bg-sky-50 text-sky-700">Drawings + examples</Badge>
              <Badge className="bg-amber-50 text-amber-800">3D tolerance zones</Badge>
            </div>
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-slate-500">GD&T Basics, rebuilt as an interactive guide</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-normal md:text-6xl">
                GD&T Reference
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                A fast, SEO-ready symbol reference with separate pages for core GD&T controls, datums, and material modifiers. Each page includes the callout, a drawing, a worked inspection example, and a rotatable 3D tolerance-zone model.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["SSR content", "Server-rendered pages for reference material.", BookOpen],
              ["3D models", "React Three Fiber scenes for tolerance zones.", Box],
              ["Comparisons", "Responsive tables for symbol differences.", TableProperties],
            ].map(([title, text, Icon]) => (
              <Card key={title as string}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{title as string}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">{text as string}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <SearchableSymbols />
      </section>
    </main>
  );
}
