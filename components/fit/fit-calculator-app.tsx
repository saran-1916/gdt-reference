"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Calculator,
  Copy,
  Database,
  Download,
  FileText,
  Gauge,
  History,
  Layers3,
  Moon,
  Printer,
  Search,
  Share2,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FitBasisSelector } from "./fit-basis-selector";
import { ToleranceLegend } from "./tolerance-legend";
import { ToleranceZoneDiagram } from "./tolerance-zone-diagram";
import { RecommendedPairsMode } from "./recommended-pairs-mode";
import { DirectToleranceMode } from "./direct-tolerance-mode";
import { GradeBasedMode } from "./grade-based-mode";
import {
  calculateFit,
  compareFits,
  engineeringExamples,
  fitRecommendations,
  formatMicron,
  formatUnit,
  gradeMultipliers,
  sizeRanges,
  supportedHoleLetters,
  supportedShaftLetters,
  toleranceWidth,
  type FitCalculation,
  type UnitSystem,
} from "@/lib/iso286";

const quickFits = [
  { holeClass: "H7", shaftClass: "g6" },
  { holeClass: "H7", shaftClass: "h6" },
  { holeClass: "H8", shaftClass: "f7" },
  { holeClass: "H7", shaftClass: "k6" },
  { holeClass: "H7", shaftClass: "p6" },
];

export function FitCalculatorApp() {
  const [nominalSize, setNominalSize] = useState(() => {
    if (typeof window === "undefined") return 50;
    const size = Number(new URLSearchParams(window.location.search).get("size"));
    return Number.isFinite(size) && size > 0 ? size : 50;
  });
  const [holeClass, setHoleClass] = useState(() => {
    if (typeof window === "undefined") return "H7";
    return new URLSearchParams(window.location.search).get("hole") ?? "H7";
  });
  const [shaftClass, setShaftClass] = useState(() => {
    if (typeof window === "undefined") return "g6";
    return new URLSearchParams(window.location.search).get("shaft") ?? "g6";
  });
  const [unit, setUnit] = useState<UnitSystem>("mm");
  const [application, setApplication] = useState("Bearing fit");
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [fitBasis, setFitBasis] = useState<"hole-basis" | "shaft-basis">(() => {
    if (typeof window === "undefined") return "hole-basis";
    const basis = new URLSearchParams(window.location.search).get("basis");
    return basis === "shaft-basis" ? "shaft-basis" : "hole-basis";
  });
  const [mode, setMode] = useState<"free-form" | "grade" | "recommended" | "direct">(() => {
    if (typeof window === "undefined") return "free-form";
    const m = new URLSearchParams(window.location.search).get("mode");
    if (m === "grade") return "grade";
    if (m === "recommended") return "recommended";
    if (m === "direct") return "direct";
    return "free-form";
  });
  const [selectedFit, setSelectedFit] = useState("H7/g6");
  const [history, setHistory] = useState<FitCalculation[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = JSON.parse(window.localStorage.getItem("fit-tool-history") ?? "[]") as Array<{
        nominalSize: number;
        holeClass: string;
        shaftClass: string;
        unit?: UnitSystem;
      }>;

      return stored.slice(0, 6).map((item) => calculateFit(item));
    } catch {
      return [];
    }
  });

  const calculation = useMemo(() => {
    try {
      return calculateFit({ nominalSize, holeClass, shaftClass, unit });
    } catch {
      return calculateFit({ nominalSize: 50, holeClass: "H7", shaftClass: "g6", unit });
    }
  }, [holeClass, nominalSize, shaftClass, unit]);

  const comparisons = useMemo(() => compareFits(nominalSize, quickFits), [nominalSize]);
  const filteredRecommendations = fitRecommendations.filter((item) =>
    [item.application, item.holeClass, item.shaftClass, item.label, item.process]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  useEffect(() => {
    window.localStorage.setItem("fit-tool-history", JSON.stringify(history.map((item) => item.input)));
  }, [history]);

  const saveCalculation = () => {
    setHistory((current) =>
      [calculation, ...current.filter((item) => item.input.holeClass !== calculation.input.holeClass || item.input.shaftClass !== calculation.input.shaftClass)].slice(0, 6),
    );
  };

  const recommendFit = (selectedApplication: string) => {
    const match = fitRecommendations.find((item) => item.application === selectedApplication);
    setApplication(selectedApplication);

    if (match) {
      setHoleClass(match.holeClass);
      setShaftClass(match.shaftClass);
    }
  };

  const exportCsv = () => {
    const rows = [
      ["Field", "Value"],
      ["Nominal size", `${nominalSize} mm`],
      ["Hole class", holeClass],
      ["Shaft class", shaftClass],
      ["Hole lower deviation", formatMicron(calculation.hole.lowerDeviation)],
      ["Hole upper deviation", formatMicron(calculation.hole.upperDeviation)],
      ["Shaft lower deviation", formatMicron(calculation.shaft.lowerDeviation)],
      ["Shaft upper deviation", formatMicron(calculation.shaft.upperDeviation)],
      ["Minimum clearance", formatMicron(calculation.minClearance)],
      ["Maximum clearance", formatMicron(calculation.maxClearance)],
      ["Fit type", calculation.fitType],
      ["Fit label", calculation.fitLabel],
    ];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `iso-286-${holeClass}-${shaftClass}-${nominalSize}mm.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareUrl = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("size", String(nominalSize));
    url.searchParams.set("hole", holeClass);
    url.searchParams.set("shaft", shaftClass);
    url.searchParams.set("basis", fitBasis);
    await navigator.clipboard.writeText(url.toString());
  };

  return (
    <main className={isDark ? "bg-[#070b12] text-slate-100" : "bg-slate-50 text-slate-950"}>
      <section className="relative overflow-hidden border-b border-sky-500/20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.11)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_14%,rgba(14,165,233,0.24),transparent_34%),linear-gradient(180deg,rgba(7,11,18,0.05),rgba(7,11,18,0.86))]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_480px] lg:py-14">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border border-sky-300/30 bg-sky-400/10 text-sky-200">ISO 286-1 / ISO 286-2</Badge>
              <Badge className="border border-white/10 bg-white/10 text-slate-200">0 to 3150 mm</Badge>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-200">Limits and fits calculator</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-normal md:text-6xl">
                Engineering-grade ISO 286 fit analysis
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Calculate hole and shaft limits, deviations, clearance, interference, fit class, application guidance, and exportable inspection data with an interactive technical visualization.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Fit type" value={calculation.fitType} tone="sky" />
              <Metric label="Fit class" value={calculation.fitLabel} tone="emerald" />
              <Metric label="IT basis" value={`${calculation.hole.designation} / ${calculation.shaft.designation}`} tone="violet" />
            </div>
          </div>
          <Card className="border-white/10 bg-white/10 text-white shadow-2xl shadow-sky-950/30 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-white">Live Fit Preview</CardTitle>
                <p className="mt-2 text-sm text-slate-300">Zero line, hole zone, shaft zone, and clearance window</p>
              </div>
              <Button variant="ghost" className="text-slate-100 hover:bg-white/10" onClick={() => setIsDark(!isDark)} aria-label="Toggle theme">
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <FitVisualization calculation={calculation} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="flex gap-3 border-b border-slate-700/50">
          <button
            onClick={() => setMode("free-form")}
            className={`px-4 py-3 text-sm font-semibold transition ${
              mode === "free-form"
                ? isDark
                  ? "border-b-2 border-sky-400 text-sky-300"
                  : "border-b-2 border-sky-500 text-sky-600"
                : isDark
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Free-Form Input
          </button>
          <button
            onClick={() => setMode("grade")}
            className={`px-4 py-3 text-sm font-semibold transition ${
              mode === "grade"
                ? isDark
                  ? "border-b-2 border-sky-400 text-sky-300"
                  : "border-b-2 border-sky-500 text-sky-600"
                : isDark
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Grade-Based Selection
          </button>
          <button
            onClick={() => setMode("recommended")}
            className={`px-4 py-3 text-sm font-semibold transition ${
              mode === "recommended"
                ? isDark
                  ? "border-b-2 border-sky-400 text-sky-300"
                  : "border-b-2 border-sky-500 text-sky-600"
                : isDark
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Recommended Pairs
          </button>
          <button
            onClick={() => setMode("direct")}
            className={`px-4 py-3 text-sm font-semibold transition ${
              mode === "direct"
                ? isDark
                  ? "border-b-2 border-sky-400 text-sky-300"
                  : "border-b-2 border-sky-500 text-sky-600"
                : isDark
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Direct Tolerance Input
          </button>
        </div>
      </section>

      {mode === "direct" ? (
        <DirectToleranceMode isDark={isDark} unit={unit} />
      ) : mode === "grade" ? (
        <GradeBasedMode isDark={isDark} unit={unit} />
      ) : mode === "free-form" ? (
        <>
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 md:px-8 xl:grid-cols-[330px_minmax(0,1fr)_330px]">
        <Card className={panelClass(isDark)}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <IconTile icon={Calculator} />
              <CardTitle>Inputs</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="Nominal size (mm)">
              <input
                value={nominalSize}
                onChange={(event) => setNominalSize(Number(event.target.value))}
                type="number"
                min="0.001"
                max="3150"
                step="0.001"
                className={inputClass(isDark)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Hole">
                <input value={holeClass} onChange={(event) => setHoleClass(event.target.value)} className={inputClass(isDark)} />
              </Field>
              <Field label="Shaft">
                <input value={shaftClass} onChange={(event) => setShaftClass(event.target.value)} className={inputClass(isDark)} />
              </Field>
            </div>
            <Field label="Application">
              <select value={application} onChange={(event) => recommendFit(event.target.value)} className={inputClass(isDark)}>
                {fitRecommendations.map((item) => (
                  <option key={item.application}>{item.application}</option>
                ))}
              </select>
            </Field>
            <Field label="Output units">
              <div className="grid grid-cols-3 rounded-md border border-slate-700/50 p-1">
                {(["mm", "micron", "inch"] as UnitSystem[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => setUnit(item)}
                    className={`rounded px-3 py-2 text-sm font-medium transition ${
                      unit === item ? "bg-sky-400 text-slate-950" : isDark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={shareUrl} variant="secondary" className="border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/20">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button onClick={saveCalculation} variant="secondary" className="border-violet-300/20 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20">
                <History className="h-4 w-4" />
                Save
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Button onClick={exportCsv} variant="secondary" className="border-emerald-300/20 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <IconTile icon={BarChart3} />
                <CardTitle>Fit Basis Selection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <FitBasisSelector currentBasis={fitBasis} onBasisChange={setFitBasis} isDark={isDark} />
            </CardContent>
          </Card>

          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <IconTile icon={BarChart3} />
                  <CardTitle>Deviation Results</CardTitle>
                </div>
                <Badge className="border border-sky-300/20 bg-sky-400/10 text-sky-200">{calculation.fitType}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <ResultBlock title="Hole Limits" items={[
                  ["ES", formatMicron(calculation.hole.upperDeviation)],
                  ["EI", formatMicron(calculation.hole.lowerDeviation)],
                  ["Max hole", calculation.hole.maxLimit.toFixed(4) + " mm"],
                  ["Min hole", calculation.hole.minLimit.toFixed(4) + " mm"],
                ]} />
                <ResultBlock title="Shaft Limits" items={[
                  ["es", formatMicron(calculation.shaft.upperDeviation)],
                  ["ei", formatMicron(calculation.shaft.lowerDeviation)],
                  ["Max shaft", calculation.shaft.maxLimit.toFixed(4) + " mm"],
                  ["Min shaft", calculation.shaft.minLimit.toFixed(4) + " mm"],
                ]} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <Metric label="Minimum clearance" value={formatUnit(calculation.minClearance, unit)} tone={calculation.minClearance < 0 ? "rose" : "emerald"} />
                <Metric label="Maximum clearance" value={formatUnit(calculation.maxClearance, unit)} tone="sky" />
                <Metric label="Maximum interference" value={formatUnit(Math.max(0, calculation.maxInterference), unit)} tone="rose" />
                <Metric label="Tolerance unit" value={`${calculation.toleranceUnit.toFixed(3)} microns`} tone="violet" />
              </div>
            </CardContent>
          </Card>

          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <IconTile icon={Layers3} />
                <CardTitle>Tolerance Zones & Deviations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ToleranceZoneDiagram calculation={calculation} isDark={isDark} />
            </CardContent>
          </Card>

          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <IconTile icon={FileText} />
                <CardTitle>Symbol Meanings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ToleranceLegend />
            </CardContent>
          </Card>

          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <IconTile icon={Gauge} />
                <CardTitle>Comparison Chart</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ComparisonChart calculations={comparisons} unit={unit} />
            </CardContent>
          </Card>

          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <IconTile icon={FileText} />
                <CardTitle>Formula Trace</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {calculation.steps.map((step) => (
                <div key={step.label} className="rounded-md border border-slate-700/50 bg-slate-950/40 p-4">
                  <p className="text-sm font-semibold text-slate-100">{step.label}</p>
                  <p className="mt-2 font-mono text-xs text-sky-200">{step.expression}</p>
                  <p className="mt-2 text-sm text-slate-300">{step.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <IconTile icon={Sparkles} />
                <CardTitle>Fit Recommendation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-slate-300">{calculation.recommendation.explanation}</p>
              <div className="rounded-md border border-sky-300/20 bg-sky-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-sky-200">Recommended standard fit</p>
                <p className="mt-2 text-2xl font-semibold text-white">{calculation.recommendation.holeClass}/{calculation.recommendation.shaftClass}</p>
                <p className="mt-1 text-sm text-slate-300">{calculation.recommendation.process}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <IconTile icon={Search} />
                <CardTitle>Search Fits</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search application, process, fit..." className={inputClass(isDark)} />
              {filteredRecommendations.slice(0, 5).map((item) => (
                <button
                  key={`${item.holeClass}-${item.shaftClass}-${item.application}`}
                  onClick={() => {
                    setHoleClass(item.holeClass);
                    setShaftClass(item.shaftClass);
                    setApplication(item.application);
                  }}
                  className="w-full rounded-md border border-slate-700/50 bg-slate-950/30 p-3 text-left transition hover:border-sky-300/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-100">{item.application}</p>
                    <span className="font-mono text-sm text-sky-200">{item.holeClass}/{item.shaftClass}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <IconTile icon={History} />
                <CardTitle>Recent Calculations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.map((item) => (
                <button
                  key={`${item.input.nominalSize}-${item.input.holeClass}-${item.input.shaftClass}`}
                  className="flex w-full items-center justify-between rounded-md border border-slate-700/50 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
                  onClick={() => {
                    setNominalSize(item.input.nominalSize);
                    setHoleClass(item.input.holeClass);
                    setShaftClass(item.input.shaftClass);
                  }}
                >
                  <span>{item.input.nominalSize} mm</span>
                  <span className="font-mono text-sky-200">{item.input.holeClass}/{item.input.shaftClass}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <IconTile icon={Database} />
                <CardTitle>ISO 286 Table Browser</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ToleranceTable nominalSize={nominalSize} />
            </CardContent>
          </Card>
          <Card className={panelClass(isDark)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <IconTile icon={Layers3} />
                <CardTitle>Engineering Examples</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {engineeringExamples.map((example) => (
                <div key={example.title} className="rounded-md border border-slate-700/50 bg-slate-950/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-100">{example.title}</p>
                    <span className="font-mono text-sm text-sky-200">{example.fit}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{example.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={() => window.print()} variant="secondary" className="border-slate-600 bg-white/10 text-slate-100 hover:bg-white/15">
            <Printer className="h-4 w-4" />
            Print report
          </Button>
          <Button onClick={shareUrl} variant="secondary" className="border-slate-600 bg-white/10 text-slate-100 hover:bg-white/15">
            <Copy className="h-4 w-4" />
            Copy share link
          </Button>
        </div>
      </section>
      </>) : (
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <RecommendedPairsMode
            nominalSize={nominalSize}
            onNominalSizeChange={setNominalSize}
            selectedFit={selectedFit}
            onFitChange={setSelectedFit}
            unit={unit}
            isDark={isDark}
            fitBasis={fitBasis}
          />
        </section>
      )}
    </main>
  );
}

function FitVisualization({ calculation }: { calculation: FitCalculation }) {
  const values = [
    calculation.hole.lowerDeviation,
    calculation.hole.upperDeviation,
    calculation.shaft.lowerDeviation,
    calculation.shaft.upperDeviation,
    0,
  ];
  const min = Math.min(...values) - 15;
  const max = Math.max(...values) + 15;
  const scale = (value: number) => 300 - ((value - min) / (max - min)) * 240;

  return (
    <svg viewBox="0 0 520 360" className="h-full min-h-[300px] w-full">
      <defs>
        <linearGradient id="holeGradient" x1="0" x2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.52" />
        </linearGradient>
        <linearGradient id="shaftGradient" x1="0" x2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0.52" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="480" height="300" rx="8" fill="rgba(15,23,42,0.64)" stroke="rgba(148,163,184,0.22)" />
      {[-100, -50, 0, 50, 100].map((tick) => {
        const y = scale(tick);
        return (
          <g key={tick}>
            <line x1="72" x2="470" y1={y} y2={y} stroke={tick === 0 ? "#e2e8f0" : "rgba(148,163,184,0.18)"} strokeDasharray={tick === 0 ? "0" : "4 6"} />
            <text x="36" y={y + 4} fill="#94a3b8" fontSize="12">{tick}</text>
          </g>
        );
      })}
      <text x="72" y="48" fill="#bae6fd" fontSize="13" fontWeight="600">Deviation from zero line, microns</text>
      <ToleranceBand x={150} y1={scale(calculation.hole.upperDeviation)} y2={scale(calculation.hole.lowerDeviation)} label={`Hole ${calculation.hole.designation}`} gradient="url(#holeGradient)" />
      <ToleranceBand x={310} y1={scale(calculation.shaft.upperDeviation)} y2={scale(calculation.shaft.lowerDeviation)} label={`Shaft ${calculation.shaft.designation}`} gradient="url(#shaftGradient)" />
      <line x1="150" x2="350" y1={scale(calculation.hole.lowerDeviation)} y2={scale(calculation.shaft.upperDeviation)} stroke="#34d399" strokeWidth="2" strokeDasharray="5 7" />
      <text x="168" y="334" fill="#cbd5e1" fontSize="12">Cmin {formatMicron(calculation.minClearance)}</text>
      <text x="310" y="334" fill="#cbd5e1" fontSize="12">Cmax {formatMicron(calculation.maxClearance)}</text>
    </svg>
  );
}

function ToleranceBand({ x, y1, y2, label, gradient }: { x: number; y1: number; y2: number; label: string; gradient: string }) {
  const top = Math.min(y1, y2);
  const height = Math.max(6, Math.abs(y2 - y1));

  return (
    <g className="transition-all duration-500">
      <rect x={x} y={top} width="88" height={height} rx="8" fill={gradient} stroke="rgba(255,255,255,0.38)" />
      <line x1={x - 26} x2={x + 114} y1={top} y2={top} stroke="rgba(255,255,255,0.36)" />
      <line x1={x - 26} x2={x + 114} y1={top + height} y2={top + height} stroke="rgba(255,255,255,0.36)" />
      <text x={x + 44} y={top + height / 2 + 4} textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{label}</text>
    </g>
  );
}

function ComparisonChart({ calculations, unit }: { calculations: FitCalculation[]; unit: UnitSystem }) {
  const values = calculations.flatMap((item) => [item.minClearance, item.maxClearance]);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const spread = Math.max(1, max - min);
  const x = (value: number) => 140 + ((value - min) / spread) * 280;

  return (
    <svg viewBox="0 0 520 250" className="h-[250px] w-full">
      <rect x="20" y="20" width="480" height="205" rx="8" fill="rgba(15,23,42,0.45)" stroke="rgba(148,163,184,0.22)" />
      <line x1={x(0)} x2={x(0)} y1="38" y2="210" stroke="#e2e8f0" strokeDasharray="4 6" />
      {calculations.map((item, index) => {
        const y = 55 + index * 34;
        return (
          <g key={`${item.hole.designation}-${item.shaft.designation}`}>
            <text x="42" y={y + 5} fill="#cbd5e1" fontSize="12" fontFamily="monospace">{item.hole.designation}/{item.shaft.designation}</text>
            <line x1={x(item.minClearance)} x2={x(item.maxClearance)} y1={y} y2={y} stroke={item.fitType === "Interference fit" ? "#fb7185" : item.fitType === "Transition fit" ? "#facc15" : "#38bdf8"} strokeWidth="8" strokeLinecap="round" />
            <circle cx={x(item.minClearance)} cy={y} r="5" fill="#0f172a" stroke="#e2e8f0" />
            <circle cx={x(item.maxClearance)} cy={y} r="5" fill="#0f172a" stroke="#e2e8f0" />
            <text x="435" y={y + 5} fill="#94a3b8" fontSize="12">{formatUnit(item.maxClearance, unit)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ToleranceTable({ nominalSize }: { nominalSize: number }) {
  const range = sizeRanges.find((item) => nominalSize > item.over && nominalSize <= item.to) ?? sizeRanges[0];
  const mean = Math.sqrt((range.over || 1) * range.to);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.14em] text-slate-400">
          <tr>
            <th className="border-b border-slate-700/60 px-3 py-3">Size step</th>
            {Object.keys(gradeMultipliers).slice(0, 9).map((grade) => (
              <th key={grade} className="border-b border-slate-700/60 px-3 py-3">IT{grade}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="text-slate-200">
            <td className="border-b border-slate-800 px-3 py-3">Over {range.over} to {range.to} mm</td>
            {Object.keys(gradeMultipliers).slice(0, 9).map((grade) => (
              <td key={grade} className="border-b border-slate-800 px-3 py-3 font-mono">{toleranceWidth(Number(grade), mean).toFixed(1)}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <p className="rounded-md border border-slate-700/50 bg-slate-950/30 p-3 text-xs leading-5 text-slate-400">
          Hole letters: {supportedHoleLetters.join(", ")}
        </p>
        <p className="rounded-md border border-slate-700/50 bg-slate-950/30 p-3 text-xs leading-5 text-slate-400">
          Shaft letters: {supportedShaftLetters.join(", ")}
        </p>
      </div>
    </div>
  );
}

function ResultBlock({ title, items }: { title: string; items: string[][] }) {
  return (
    <div className="rounded-md border border-slate-700/60 bg-slate-950/35 p-4">
      <p className="font-semibold text-slate-100">{title}</p>
      <div className="mt-3 space-y-2">
        {items.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="font-mono text-slate-100">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "sky" | "emerald" | "violet" | "rose" }) {
  const tones = {
    sky: "border-sky-300/20 bg-sky-400/10 text-sky-100",
    emerald: "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
    violet: "border-violet-300/20 bg-violet-400/10 text-violet-100",
    rose: "border-rose-300/20 bg-rose-400/10 text-rose-100",
  };

  return (
    <div className={`rounded-md border p-4 ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-md border border-sky-300/20 bg-sky-400/10 text-sky-200">
      <Icon className="h-5 w-5" />
    </div>
  );
}

function panelClass(isDark: boolean) {
  return isDark
    ? "border-white/10 bg-white/[0.06] text-slate-100 shadow-xl shadow-slate-950/20 backdrop-blur"
    : "border-slate-200 bg-white text-slate-950";
}

function inputClass(isDark: boolean) {
  return `h-11 w-full rounded-md border px-3 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-400/20 ${
    isDark ? "border-slate-700 bg-slate-950/60 text-slate-100" : "border-slate-300 bg-white text-slate-950"
  }`;
}
