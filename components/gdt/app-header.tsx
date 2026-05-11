import Link from "next/link";
import { BookOpen, Calculator, Ruler, Table2 } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Reference" },
  { href: "/fit-tool", label: "Fit Tool" },
  { href: "/fit-tool/tolerance-tables", label: "Tables" },
  { href: "/fit-tool/guide", label: "Guide" },
  { href: "/fit-tool/examples", label: "Examples" },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-950 text-sky-200 shadow-sm">
            <Ruler className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-950">GD&T Reference</p>
            <p className="hidden text-xs font-medium uppercase tracking-[0.12em] text-slate-500 sm:block">
              Symbols, modifiers, calculators
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LinkButton href="/fit-tool/tolerance-tables" variant="ghost" className="shrink-0 px-3">
            <Table2 className="h-4 w-4" />
            <span className="sr-only">Tolerance tables</span>
          </LinkButton>
          <LinkButton href="/fit-tool/guide" variant="ghost" className="shrink-0 px-3">
            <BookOpen className="h-4 w-4" />
            <span className="sr-only">ISO guide</span>
          </LinkButton>
        </div>

        <LinkButton href="/fit-tool" variant="secondary" className="shrink-0 border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100">
          <Calculator className="h-4 w-4" />
          <span className="hidden sm:inline">Fit Tool</span>
        </LinkButton>
      </div>
    </header>
  );
}
