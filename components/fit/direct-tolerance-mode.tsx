"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, Calculator, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateFit, fitRecommendations, formatUnit, type FitType, type UnitSystem } from "@/lib/iso286";

interface DirectToleranceModeProps {
  isDark: boolean;
  unit: UnitSystem;
}

interface DirectResult {
  holeMax: number;
  holeMin: number;
  shaftMax: number;
  shaftMin: number;
  holeTolerance: number;
  shaftTolerance: number;
  maxClearance: number;
  minClearance: number;
  maxInterference: number;
  fitType: FitType;
  fitLabel: string;
  matchedISO: string | null;
}

function classifyDirectFit(minClearance: number, maxClearance: number): FitType {
  if (minClearance > 0) return "Clearance fit";
  if (maxClearance < 0) return "Interference fit";
  return "Transition fit";
}

function classifyDirectFitLabel(fitType: FitType, minClearance: number, maxClearance: number) {
  if (fitType === "Clearance fit") {
    if (maxClearance > 120) return "Loose running fit";
    if (maxClearance > 55) return "Running fit";
    if (maxClearance > 25) return "Sliding fit";
    return "Precision running fit";
  }
  if (fitType === "Interference fit") {
    if (Math.abs(maxClearance) > 80) return "Shrink fit";
    if (Math.abs(maxClearance) > 35) return "Press fit";
    return "Light press fit";
  }
  return minClearance < -20 ? "Push fit" : "Close transition fit";
}

export function DirectToleranceMode({ isDark, unit }: DirectToleranceModeProps) {
  const [nominalSize, setNominalSize] = useState(50);
  const [holeES, setHoleES] = useState(25);
  const [holeEI, setHoleEI] = useState(0);
  const [shaftEs, setShaftEs] = useState(-9);
  const [shaftEi, setShaftEi] = useState(-25);

  const result = useMemo((): DirectResult | null => {
    if (!Number.isFinite(nominalSize) || nominalSize <= 0 || nominalSize > 3150) return null;
    if (holeES <= holeEI) return null;
    if (shaftEs <= shaftEi) return null;

    const holeMax = nominalSize + holeES / 1000;
    const holeMin = nominalSize + holeEI / 1000;
    const shaftMax = nominalSize + shaftEs / 1000;
    const shaftMin = nominalSize + shaftEi / 1000;
    const holeTolerance = Math.round((holeES - holeEI) * 10) / 10;
    const shaftTolerance = Math.round((shaftEs - shaftEi) * 10) / 10;
    const maxClearance = Math.round((holeES - shaftEi) * 10) / 10;
    const minClearance = Math.round((holeEI - shaftEs) * 10) / 10;
    const maxInterference = Math.round((shaftEs - holeEI) * 10) / 10;
    const fitType = classifyDirectFit(minClearance, maxClearance);
    const fitLabel = classifyDirectFitLabel(fitType, minClearance, maxClearance);

    let matchedISO: string | null = null;
    for (const rec of fitRecommendations) {
      try {
        const calc = calculateFit({ nominalSize, holeClass: rec.holeClass, shaftClass: rec.shaftClass });
        if (
          Math.abs(calc.hole.upperDeviation - holeES) < 2 &&
          Math.abs(calc.hole.lowerDeviation - holeEI) < 2 &&
          Math.abs(calc.shaft.upperDeviation - shaftEs) < 2 &&
          Math.abs(calc.shaft.lowerDeviation - shaftEi) < 2
        ) {
          matchedISO = `${rec.holeClass}/${rec.shaftClass}`;
          break;
        }
      } catch {
        // skip invalid combinations
      }
    }

    return {
      holeMax,
      holeMin,
      shaftMax,
      shaftMin,
      holeTolerance,
      shaftTolerance,
      maxClearance,
      minClearance,
      maxInterference,
      fitType,
      fitLabel,
      matchedISO,
    };
  }, [nominalSize, holeES, holeEI, shaftEs, shaftEi]);

  const input = inputClass(isDark);
  const panel = panelClass(isDark);

  const validationError =
    holeES <= holeEI
      ? "Hole ES must be greater than EI"
      : shaftEs <= shaftEi
        ? "Shaft es must be greater than ei"
        : null;

  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 md:px-8 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="space-y-5">
        <Card className={panel}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <IconTile icon={Calculator} />
              <div>
                <CardTitle>Direct Tolerance Input</CardTitle>
                <p className="mt-1 text-xs text-slate-400">Enter deviations from nominal (in microns)</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="Nominal size (mm)">
              <input
                type="number"
                value={nominalSize}
                onChange={(e) => setNominalSize(Number(e.target.value))}
                min="0.001"
                max="3150"
                step="0.001"
                className={input}
              />
            </Field>

            <div className="rounded-md border border-sky-300/20 bg-sky-400/8 p-4 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200">Hole Deviations (μm)</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="ES — upper dev">
                  <input
                    type="number"
                    value={holeES}
                    onChange={(e) => setHoleES(Number(e.target.value))}
                    step="0.1"
                    className={input}
                  />
                </Field>
                <Field label="EI — lower dev">
                  <input
                    type="number"
                    value={holeEI}
                    onChange={(e) => setHoleEI(Number(e.target.value))}
                    step="0.1"
                    className={input}
                  />
                </Field>
              </div>
              <p className="text-xs text-slate-400">
                e.g. H7 at 50mm → ES = +25, EI = 0
              </p>
            </div>

            <div className="rounded-md border border-violet-300/20 bg-violet-400/8 p-4 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-200">Shaft Deviations (μm)</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="es — upper dev">
                  <input
                    type="number"
                    value={shaftEs}
                    onChange={(e) => setShaftEs(Number(e.target.value))}
                    step="0.1"
                    className={input}
                  />
                </Field>
                <Field label="ei — lower dev">
                  <input
                    type="number"
                    value={shaftEi}
                    onChange={(e) => setShaftEi(Number(e.target.value))}
                    step="0.1"
                    className={input}
                  />
                </Field>
              </div>
              <p className="text-xs text-slate-400">
                e.g. g6 at 50mm → es = −9, ei = −25
              </p>
            </div>

            {validationError && (
              <div className="rounded-md border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">
                {validationError}
              </div>
            )}

            <div className={`rounded-md border p-3 ${isDark ? "border-slate-700/50 bg-slate-950/30" : "border-slate-200 bg-slate-50"}`}>
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p className="text-xs leading-5 text-slate-400">
                  Enter the signed deviations exactly as shown on a drawing. Positive values are above nominal; negative values are below. The fit gap is calculated directly from these values without requiring an ISO class code.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        {result ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Fit type"
                value={result.fitType}
                tone={result.fitType === "Clearance fit" ? "emerald" : result.fitType === "Interference fit" ? "rose" : "amber"}
              />
              <MetricCard label="Fit class" value={result.fitLabel} tone="sky" />
              {result.matchedISO ? (
                <MetricCard label="Matches ISO class" value={result.matchedISO} tone="violet" />
              ) : (
                <MetricCard label="ISO match" value="Custom tolerance" tone="slate" />
              )}
            </div>

            <Card className={panel}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <IconTile icon={BarChart3} />
                    <CardTitle>Fit Gap Results</CardTitle>
                  </div>
                  <Badge className="border border-sky-300/20 bg-sky-400/10 text-sky-200">{result.fitType}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <ResultVal
                    label="Min clearance"
                    value={formatUnit(result.minClearance, unit)}
                    tone={result.minClearance > 0 ? "emerald" : "rose"}
                    note={result.minClearance < 0 ? "(interference)" : undefined}
                  />
                  <ResultVal label="Max clearance" value={formatUnit(result.maxClearance, unit)} tone="sky" />
                  <ResultVal
                    label="Max interference"
                    value={formatUnit(Math.max(0, result.maxInterference), unit)}
                    tone="rose"
                  />
                </div>

                <div className="mt-5">
                  <ClearanceBar minClearance={result.minClearance} maxClearance={result.maxClearance} isDark={isDark} />
                </div>
              </CardContent>
            </Card>

            <Card className={panel}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconTile icon={ArrowRight} />
                  <CardTitle>Dimensional Limits</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <LimitBlock
                    title="Hole"
                    upper={holeES}
                    lower={holeEI}
                    maxLimit={result.holeMax}
                    minLimit={result.holeMin}
                    tolerance={result.holeTolerance}
                    nominalSize={nominalSize}
                    unit={unit}
                    tone="sky"
                  />
                  <LimitBlock
                    title="Shaft"
                    upper={shaftEs}
                    lower={shaftEi}
                    maxLimit={result.shaftMax}
                    minLimit={result.shaftMin}
                    tolerance={result.shaftTolerance}
                    nominalSize={nominalSize}
                    unit={unit}
                    tone="violet"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className={panel}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconTile icon={BarChart3} />
                  <CardTitle>Tolerance Zone Diagram</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <DirectZoneDiagram
                  holeES={holeES}
                  holeEI={holeEI}
                  shaftEs={shaftEs}
                  shaftEi={shaftEi}
                  minClearance={result.minClearance}
                  maxClearance={result.maxClearance}
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <div className={`rounded-xl border p-10 text-center ${isDark ? "border-slate-700/50 bg-white/[0.04]" : "border-slate-200 bg-white"}`}>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Enter valid nominal size and deviation values to see fit gap results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ClearanceBar({
  minClearance,
  maxClearance,
  isDark,
}: {
  minClearance: number;
  maxClearance: number;
  isDark: boolean;
}) {
  const spread = Math.max(1, maxClearance - minClearance);
  const padding = spread * 0.4;
  const domainMin = minClearance - padding;
  const domainMax = maxClearance + padding;
  const domainSpread = domainMax - domainMin;
  const toX = (v: number) => 60 + ((v - domainMin) / domainSpread) * 380;
  const zeroX = toX(0);
  const barX = toX(minClearance);
  const barW = Math.max(4, toX(maxClearance) - barX);
  const fitColor =
    minClearance > 0
      ? "#34d399"
      : maxClearance < 0
        ? "#fb7185"
        : "#facc15";

  return (
    <svg viewBox="0 0 500 90" className="w-full">
      <rect x="50" y="10" width="400" height="70" rx="6" fill={isDark ? "rgba(15,23,42,0.5)" : "rgba(241,245,249,0.8)"} stroke={isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.4)"} />
      <line x1={zeroX} x2={zeroX} y1="15" y2="72" stroke={isDark ? "#e2e8f0" : "#334155"} strokeDasharray="4 5" />
      <text x={zeroX} y="84" textAnchor="middle" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="10">0</text>
      <rect x={barX} y="28" width={barW} height="28" rx="5" fill={fitColor} opacity="0.82" />
      <circle cx={barX} cy="42" r="5" fill={isDark ? "#0f172a" : "#fff"} stroke={fitColor} strokeWidth="2" />
      <circle cx={barX + barW} cy="42" r="5" fill={isDark ? "#0f172a" : "#fff"} stroke={fitColor} strokeWidth="2" />
      <text x={barX} y="22" textAnchor="middle" fill={isDark ? "#cbd5e1" : "#475569"} fontSize="10">{minClearance > 0 ? "+" : ""}{minClearance.toFixed(1)} μm</text>
      <text x={barX + barW} y="22" textAnchor="middle" fill={isDark ? "#cbd5e1" : "#475569"} fontSize="10">{maxClearance > 0 ? "+" : ""}{maxClearance.toFixed(1)} μm</text>
      <text x="250" y="74" textAnchor="middle" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="10">← Interference | Clearance →</text>
    </svg>
  );
}

function DirectZoneDiagram({
  holeES,
  holeEI,
  shaftEs,
  shaftEi,
  minClearance,
  maxClearance,
}: {
  holeES: number;
  holeEI: number;
  shaftEs: number;
  shaftEi: number;
  minClearance: number;
  maxClearance: number;
}) {
  const all = [holeES, holeEI, shaftEs, shaftEi, 0];
  const vMin = Math.min(...all) - 12;
  const vMax = Math.max(...all) + 12;
  const scale = (v: number) => 290 - ((v - vMin) / (vMax - vMin)) * 230;

  return (
    <svg viewBox="0 0 520 340" className="h-full min-h-[280px] w-full">
      <rect x="20" y="15" width="480" height="295" rx="8" fill="rgba(15,23,42,0.6)" stroke="rgba(148,163,184,0.18)" />
      {[holeES, holeEI, shaftEs, shaftEi, 0]
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .map((tick) => (
          <g key={tick}>
            <line x1="72" x2="468" y1={scale(tick)} y2={scale(tick)} stroke={tick === 0 ? "#e2e8f0" : "rgba(148,163,184,0.15)"} strokeDasharray={tick === 0 ? "0" : "4 6"} />
            <text x="36" y={scale(tick) + 4} fill="#94a3b8" fontSize="11" textAnchor="middle">{tick > 0 ? "+" : ""}{tick}</text>
          </g>
        ))}
      <text x="72" y="36" fill="#bae6fd" fontSize="12" fontWeight="600">Deviation (μm)</text>
      <ZoneBand x={150} y1={scale(holeES)} y2={scale(holeEI)} label="Hole" color="rgba(56,189,248,0.82)" stroke="#38bdf8" />
      <ZoneBand x={310} y1={scale(shaftEs)} y2={scale(shaftEi)} label="Shaft" color="rgba(167,139,250,0.82)" stroke="#a78bfa" />
      <text x="168" y="320" fill="#cbd5e1" fontSize="11">Cmin {minClearance > 0 ? "+" : ""}{minClearance.toFixed(1)} μm</text>
      <text x="310" y="320" fill="#cbd5e1" fontSize="11">Cmax {maxClearance > 0 ? "+" : ""}{maxClearance.toFixed(1)} μm</text>
    </svg>
  );
}

function ZoneBand({ x, y1, y2, label, color, stroke }: { x: number; y1: number; y2: number; label: string; color: string; stroke: string }) {
  const top = Math.min(y1, y2);
  const h = Math.max(6, Math.abs(y2 - y1));
  return (
    <g>
      <rect x={x} y={top} width="88" height={h} rx="7" fill={color} stroke={stroke} strokeOpacity="0.5" />
      <line x1={x - 20} x2={x + 108} y1={top} y2={top} stroke="rgba(255,255,255,0.3)" />
      <line x1={x - 20} x2={x + 108} y1={top + h} y2={top + h} stroke="rgba(255,255,255,0.3)" />
      <text x={x + 44} y={top + h / 2 + 4} textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{label}</text>
    </g>
  );
}

function LimitBlock({
  title,
  upper,
  lower,
  maxLimit,
  minLimit,
  tolerance,
  nominalSize,
  unit,
  tone,
}: {
  title: string;
  upper: number;
  lower: number;
  maxLimit: number;
  minLimit: number;
  tolerance: number;
  nominalSize: number;
  unit: UnitSystem;
  tone: "sky" | "violet";
}) {
  const borderColor = tone === "sky" ? "border-sky-300/20" : "border-violet-300/20";
  const labelColor = tone === "sky" ? "text-sky-200" : "text-violet-200";

  return (
    <div className={`rounded-md border ${borderColor} bg-slate-950/35 p-4`}>
      <p className={`font-semibold ${labelColor}`}>{title}</p>
      <div className="mt-3 space-y-2">
        {[
          [title === "Hole" ? "ES (upper dev)" : "es (upper dev)", `${upper > 0 ? "+" : ""}${upper} μm`],
          [title === "Hole" ? "EI (lower dev)" : "ei (lower dev)", `${lower > 0 ? "+" : ""}${lower} μm`],
          ["Tolerance", `${tolerance} μm`],
          ["Max size", `${maxLimit.toFixed(4)} mm`],
          ["Min size", `${minLimit.toFixed(4)} mm`],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="font-mono text-slate-100">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultVal({
  label,
  value,
  tone,
  note,
}: {
  label: string;
  value: string;
  tone: "emerald" | "sky" | "rose";
  note?: string;
}) {
  const styles = {
    emerald: "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
    sky: "border-sky-300/20 bg-sky-400/10 text-sky-100",
    rose: "border-rose-300/20 bg-rose-400/10 text-rose-100",
  };
  return (
    <div className={`rounded-md border p-4 ${styles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
      {note && <p className="mt-1 text-xs opacity-60">{note}</p>}
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "sky" | "emerald" | "violet" | "rose" | "amber" | "slate";
}) {
  const styles: Record<string, string> = {
    sky: "border-sky-300/20 bg-sky-400/10 text-sky-100",
    emerald: "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
    violet: "border-violet-300/20 bg-violet-400/10 text-violet-100",
    rose: "border-rose-300/20 bg-rose-400/10 text-rose-100",
    amber: "border-amber-300/20 bg-amber-400/10 text-amber-100",
    slate: "border-slate-700/50 bg-slate-950/30 text-slate-300",
  };
  return (
    <div className={`rounded-md border p-4 ${styles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
      <p className="mt-2 text-base font-semibold">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function IconTile({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-sky-300/20 bg-sky-400/10 text-sky-200">
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
