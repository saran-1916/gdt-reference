"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { gdtCategories, gdtPages } from "@/lib/gdt-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

export function SearchableSymbols() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const visiblePages = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return gdtPages.filter((page) => {
      const matchesCategory = category === "All" || page.category === category;
      const haystack = `${page.name} ${page.formalName} ${page.category} ${page.summary}`.toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [category, query]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search symbols, categories, or use cases"
            className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {gdtCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`h-10 rounded-md border px-4 text-sm font-medium transition ${
                category === item
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {visiblePages.map((page) => (
          <Card key={page.slug} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-md bg-slate-950 font-mono text-3xl text-white">
                  {page.symbol}
                </div>
                <Badge>{page.category}</Badge>
              </div>
              <CardTitle>{page.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-5">
              <p className="text-sm leading-6 text-slate-600">{page.summary}</p>
              <LinkButton href={`/${page.slug}`} variant="secondary" className="mt-auto w-full">
                Open page
              </LinkButton>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
