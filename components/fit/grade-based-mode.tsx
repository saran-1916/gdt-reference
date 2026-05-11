"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BarChart3, Calculator, CheckCircle2, Info, Layers3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  calculateFit,
  fitRecommendations,
  formatMicron,
  formatUnit,
  type FitCalculation,
  type UnitSystem,
} from "@/lib/iso286";

// ─── data tables ────────────────────────────────────────────────────────────

interface Process {
  label: string;
  itGrade: number;
  description: string;
}

const processes: Process[] = [
  { label: "Lapping / Superfinishing", itGrade: 5, description: "IT5 — Ultra-precision: gauges, spindle surfaces" },
  { label: "Cylindrical grinding", itGrade: 6, description: "IT6 — Precision shafts, bearing journals, ground bores" },
  { label: "Fine boring / Honing", itGrade: 7, description: "IT7 — Bearing housings, cylinder bores, reamed holes" },
  { label: "Reaming", itGrade: 7, description: "IT7 — Precise through-holes, close-tolerance bores" },
  { label: "Precision turning (CNC)", itGrade: 7, description: "IT7 — Accurate turned shafts and shoulders" },
  { label: "Standard turning / Boring", itGrade: 8, description: "IT8 — General machined shafts and housings" },
  { label: "Rough turning / Milling", itGrade: 10, description: "IT10 — Roughed stock, semi-finished surfaces" },
  { label: "Drilling", itGrade: 11, description: "IT11 — Through-holes, clearance holes" },
  { label: "Die casting / Extrusion", itGrade: 11, description: "IT11 — Net-shape cast or extruded profiles" },
  { label: "Stamping / Forging", itGrade: 13, description: "IT13 — Formed blanks before machining" },
  { label: "Sand casting", itGrade: 15, description: "IT15 — As-cast surfaces, rough datum faces" },
];

interface FitFunction {
  label: string;
  category: "Clearance" | "Transition" | "Interference";
  holeLetterHB: string;
  shaftLetterHB: string;
  holeLetterSB: string;
  shaftLetterSB: string;
  typicalGrade: number;
  note: string;
}

const fitFunctions: FitFunction[] = [
  {
    label: "Loose running — easy assembly, generous clearance",
    category: "Clearance",
    holeLetterHB: "H", shaftLetterHB: "d",
    holeLetterSB: "D", shaftLetterSB: "h",
    typicalGrade: 9,
    note: "Generous clearance for poorly aligned parts, temperature variation, or contaminated environments.",
  },
  {
    label: "Easy running — lubricated continuous rotation",
    category: "Clearance",
    holeLetterHB: "H", shaftLetterHB: "e",
    holeLetterSB: "E", shaftLetterSB: "h",
    typicalGrade: 8,
    note: "Reliable oil-film clearance for journals running continuously at moderate speed.",
  },
  {
    label: "Running fit — general rotating shafts",
    category: "Clearance",
    holeLetterHB: "H", shaftLetterHB: "f",
    holeLetterSB: "F", shaftLetterSB: "h",
    typicalGrade: 7,
    note: "Standard choice for most rotating components: motors, gearboxes, pumps.",
  },
  {
    label: "Close running / Sliding — accurate location with motion",
    category: "Clearance",
    holeLetterHB: "H", shaftLetterHB: "g",
    holeLetterSB: "G", shaftLetterSB: "h",
    typicalGrade: 6,
    note: "Small controlled clearance; accurate alignment under light loads or intermittent movement.",
  },
  {
    label: "Location clearance — snug, no intended movement",
    category: "Clearance",
    holeLetterHB: "H", shaftLetterHB: "h",
    holeLetterSB: "H", shaftLetterSB: "h",
    typicalGrade: 7,
    note: "Parts can be assembled by hand but show no play; used for locating pins, bushings.",
  },
  {
    label: "Transition — slight clearance or interference",
    category: "Transition",
    holeLetterHB: "H", shaftLetterHB: "k",
    holeLetterSB: "K", shaftLetterSB: "h",
    typicalGrade: 6,
    note: "Good location accuracy; assembly by light mallet. Suitable for gears and pulleys on shafts.",
  },
  {
    label: "Transition — predominantly interference",
    category: "Transition",
    holeLetterHB: "H", shaftLetterHB: "n",
    holeLetterSB: "N", shaftLetterSB: "h",
    typicalGrade: 6,
    note: "Requires a press for assembly; good concentricity. Used for coupling hubs and tight bushings.",
  },
  {
    label: "Light interference — semi-permanent location",
    category: "Interference",
    holeLetterHB: "H", shaftLetterHB: "p",
    holeLetterSB: "P", shaftLetterSB: "h",
    typicalGrade: 6,
    note: "Holds under normal loads without keys or screws; press-fit assembly.",
  },
  {
    label: "Medium interference — press fit / driven assembly",
    category: "Interference",
    holeLetterHB: "H", shaftLetterHB: "s",
    holeLetterSB: "S", shaftLetterSB: "h",
    typicalGrade: 6,
    note: "Standard press fit for bearing rings, flanges, and collars that must not slip under torque.",
  },
  {
    label: "Heavy interference — shrink / thermal assembly",
    category: "Interference",
    holeLetterHB: "H", shaftLetterHB: "u",
    holeLetterSB: "U", shaftLetterSB: "h",
    typicalGrade: 6,
    note: "High holding force; thermal expansion required for assembly. Used in heavy-duty torque joints.",
  },
];

// ─── component ──────────────────────────────────────────────────────────────

interface GradeBasedModeProps {
  isDark: boolean;
  unit: UnitSystem;
}

export function GradeBasedMode({ isDark, unit }: GradeBasedModeProps) {
  const [nominalSize, setNominalSize] = useState(50);
  const [holeProcessIdx, setHoleProcessIdx] = useState(2); // Fine boring IT7
  const [shaftProcessIdx, setShaftProcessIdx] = useState(1); // Grinding IT6
  const [fitFunctionIdx, setFitFunctionIdx] = useState(2); // Running fit
  const [fitBasis, setFitBasis] = useState<"hole-basis" | "shaft-basis">("hole-basis");

  const holeProcess = processes[holeProcessIdx];
  const shaftProcess = processes[shaftProcessIdx];
  const fitFn = fitFunctions[fitFunctionIdx];

  const holeClass = fitBasis === "hole-basis"
    ? `${fitFn.holeLetterHB}${holeProcess.itGrade}`
    : `${fitFn.holeLetterSB}${holeProcess.itGrade}`;
  const shaftClass = fitBasis === "hole-basis"
    ? `${fitFn.shaftLetterHB}${shaftProcess.itGrade}`
    : `${fitFn.shaftLetterSB}${shaftProcess.itGrade}`;

  const { calculation, error } = useMemo(() => {
    try {
      return {
        calculation: calculateFit({ nominalSize, holeClass, shaftClass, unit }),
        error: null,
      };
    } catch (e) {
      return { calculation: null, error: e instanceof Error ? e.message : "Calculation error" };
    }
  }, [nominalSize, holeClass, shaftClass, unit]);

  const gradeGap = Math.abs(holeProcess.itGrade - fitFn.typicalGrade) + Math.abs(shaftProcess.itGrade - fitFn.typicalGrade);
  const gradeWarning = gradeGap > 2
    ? `Selected processes produce IT${holeProcess.itGrade}/${shaftProcess.itGrade}. This fit function is typically achieved at IT${fitFn.typicalGrade}. Results are valid but may not represent the optimal tolerance band for this fit type.`
    : null;

  const relatedRec = fitRecommendations.find(
    (r) => r.holeClass.toLowerCase() === holeClass.toLowerCase() && r.shaftClass.toLowerCase() === shaftClass.toLowerCase(),
  );

  const input = inputClass(isDark);
  const panel = panelClass(isDark);

  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 md:px-8 xl:grid-cols-[380px_minmax(0,1fr)]">
      {/* ── LEFT: inputs ── */}
      <div className="space-y-5">
        <Card className={panel}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <IconTile icon={Calculator} />
              <div>
                <CardTitle>Grade-Based Selection</CardTitle>
                <p className="mt-1 text-xs text-slate-400">Select manufacturing process and fit function</p>
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

            {/* Fit basis toggle */}
            <Field label="Fit basis">
              <div className="grid grid-cols-2 rounded-md border border-slate-700/50 p-1">
                {(["hole-basis", "shaft-basis"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setFitBasis(b)}
                    className={`rounded px-3 py-2 text-sm font-medium transition ${
                      fitBasis === b
                        ? "bg-sky-400 text-slate-950"
                        : isDark
                          ? "text-slate-300 hover:bg-white/10"
                          : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {b === "hole-basis" ? "Hole Basis (H)" : "Shaft Basis (h)"}
                  </button>
                ))}
              </div>
            </Field>

            {/* Hole process */}
            <div className="rounded-md border border-sky-300/20 bg-sky-400/[0.06] p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200">Hole Manufacturing Process</p>
              <select
                value={holeProcessIdx}
                onChange={(e) => setHoleProcessIdx(Number(e.target.value))}
                className={input}
              >
                {processes.map((p, i) => (
                  <option key={p.label} value={i}>{p.label}</option>
                ))}
              </select>
              <div className={`rounded-md p-2 text-xs ${isDark ? "bg-slate-950/40 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                {holeProcess.description}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Achievable grade:</span>
                <Badge className="border-sky-300/30 bg-sky-400/10 text-sky-200 text-xs">IT{holeProcess.itGrade}</Badge>
              </div>
            </div>

            {/* Shaft process */}
            <div className="rounded-md border border-violet-300/20 bg-violet-400/[0.06] p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-200">Shaft Manufacturing Process</p>
              <select
                value={shaftProcessIdx}
                onChange={(e) => setShaftProcessIdx(Number(e.target.value))}
                className={input}
              >
                {processes.map((p, i) => (
                  <option key={p.label} value={i}>{p.label}</option>
                ))}
              </select>
              <div className={`rounded-md p-2 text-xs ${isDark ? "bg-slate-950/40 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                {shaftProcess.description}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Achievable grade:</span>
                <Badge className="border-violet-300/30 bg-violet-400/10 text-violet-200 text-xs">IT{shaftProcess.itGrade}</Badge>
              </div>
            </div>

            {/* Fit function */}
            <Field label="Required fit function">
              <select
                value={fitFunctionIdx}
                onChange={(e) => setFitFunctionIdx(Number(e.target.value))}
                className={input}
              >
                {fitFunctions.map((f, i) => (
                  <option key={f.label} value={i}>{f.label}</option>
                ))}
              </select>
            </Field>
            <div className={`rounded-md border p-3 ${isDark ? "border-slate-700/50 bg-slate-950/30" : "border-slate-200 bg-slate-50"}`}>
              <p className="text-xs leading-5 text-slate-400">{fitFn.note}</p>
            </div>
          </CardContent>
        </Card>

        {/* Grade info reference card */}
        <Card className={panel}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <IconTile icon={Info} />
              <CardTitle>IT Grade Reference</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ITGradeTable isDark={isDark} highlightGrades={[holeProcess.itGrade, shaftProcess.itGrade]} />
          </CardContent>
        </Card>
      </div>

      {/* ── RIGHT: results ── */}
      <div className="space-y-5">
        {/* Derived designation banner */}
        <div className={`rounded-xl border p-5 ${isDark ? "border-sky-300/20 bg-sky-400/[0.07]" : "border-sky-200 bg-sky-50"}`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${isDark ? "text-sky-300" : "text-sky-600"}`}>
            Derived tolerance designation
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span className={`text-4xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {holeClass}/{shaftClass}
            </span>
            <div className="space-y-1">
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Hole: <span className="font-mono font-semibold">{holeClass}</span> &nbsp;·&nbsp; {fitBasis === "hole-basis" ? fitFn.holeLetterHB : fitFn.holeLetterSB} letter + IT{holeProcess.itGrade} from {holeProcess.label.toLowerCase()}
              </p>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Shaft: <span className="font-mono font-semibold">{shaftClass}</span> &nbsp;·&nbsp; {fitBasis === "hole-basis" ? fitFn.shaftLetterHB : fitFn.shaftLetterSB} letter + IT{shaftProcess.itGrade} from {shaftProcess.label.toLowerCase()}
              </p>
            </div>
          </div>
          {gradeWarning && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-300/30 bg-amber-400/10 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-xs leading-5 text-amber-200">{gradeWarning}</p>
            </div>
          )}
          {!gradeWarning && calculation && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-emerald-300/20 bg-emerald-400/10 p-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
              <p className="text-xs text-emerald-200">Process grades are well-matched to the selected fit function.</p>
            </div>
          )}
          {relatedRec && (
            <p className={`mt-3 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Application note: {relatedRec.explanation}
            </p>
          )}
        </div>

        {error ? (
          <div className="rounded-md border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div>
        ) : calculation ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard label="Fit type" value={calculation.fitType} tone={fitTypeTone(calculation.fitType)} />
              <MetricCard label="Fit class" value={calculation.fitLabel} tone="sky" />
              <MetricCard label="Tolerance category" value={fitFn.category} tone="violet" />
            </div>

            <Card className={panel}>
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
                  <ResultBlock
                    title={`Hole — ${calculation.hole.designation}`}
                    items={[
                      ["ES (upper dev)", formatMicron(calculation.hole.upperDeviation)],
                      ["EI (lower dev)", formatMicron(calculation.hole.lowerDeviation)],
                      ["Tolerance width", `${calculation.hole.tolerance.toFixed(1)} μm`],
                      ["Max hole", `${calculation.hole.maxLimit.toFixed(4)} mm`],
                      ["Min hole", `${calculation.hole.minLimit.toFixed(4)} mm`],
                    ]}
                    tone="sky"
                  />
                  <ResultBlock
                    title={`Shaft — ${calculation.shaft.designation}`}
                    items={[
                      ["es (upper dev)", formatMicron(calculation.shaft.upperDeviation)],
                      ["ei (lower dev)", formatMicron(calculation.shaft.lowerDeviation)],
                      ["Tolerance width", `${calculation.shaft.tolerance.toFixed(1)} μm`],
                      ["Max shaft", `${calculation.shaft.maxLimit.toFixed(4)} mm`],
                      ["Min shaft", `${calculation.shaft.minLimit.toFixed(4)} mm`],
                    ]}
                    tone="violet"
                  />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MetricCard
                    label="Min clearance"
                    value={formatUnit(calculation.minClearance, unit)}
                    tone={calculation.minClearance > 0 ? "emerald" : "rose"}
                  />
                  <MetricCard label="Max clearance" value={formatUnit(calculation.maxClearance, unit)} tone="sky" />
                  <MetricCard
                    label="Max interference"
                    value={formatUnit(Math.max(0, calculation.maxInterference), unit)}
                    tone="rose"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className={panel}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconTile icon={Layers3} />
                  <CardTitle>Tolerance Zone Diagram</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <GradeZoneDiagram calculation={calculation} />
              </CardContent>
            </Card>

            <Card className={panel}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconTile icon={BarChart3} />
                  <CardTitle>Process Comparison — Same Fit at Other Grades</CardTitle>
                </div>
                <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  How the fit gap changes if you use a finer or coarser manufacturing process.
                </p>
              </CardHeader>
              <CardContent>
                <GradeComparisonTable
                  nominalSize={nominalSize}
                  fitFn={fitFn}
                  fitBasis={fitBasis}
                  currentHoleGrade={holeProcess.itGrade}
                  currentShaftGrade={shaftProcess.itGrade}
                  unit={unit}
                  isDark={isDark}
                />
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}

// ─── sub-components ──────────────────────────────────────────────────────────

function ITGradeTable({ isDark, highlightGrades }: { isDark: boolean; highlightGrades: number[] }) {
  const rows = [
    { grades: "IT5 – IT6", process: "Grinding, lapping, honing", application: "Precision spindles, bearing journals" },
    { grades: "IT7 – IT8", process: "Fine boring, reaming, precision turning", application: "General fits: H7/g6, H7/k6, H8/f7" },
    { grades: "IT9 – IT10", process: "Standard turning, boring, milling", application: "Loose clearance, keyed assemblies" },
    { grades: "IT11 – IT12", process: "Drilling, die casting, extrusion", application: "Clearance holes, non-critical fits" },
    { grades: "IT13 – IT16", process: "Stamping, forging, sand casting", application: "Rough blanks, as-formed surfaces" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className={`text-slate-400 ${isDark ? "" : "text-slate-500"}`}>
            <th className="border-b border-slate-700/50 py-2 pr-4 font-semibold uppercase tracking-[0.12em]">Grade</th>
            <th className="border-b border-slate-700/50 py-2 pr-4 font-semibold uppercase tracking-[0.12em]">Process</th>
            <th className="border-b border-slate-700/50 py-2 font-semibold uppercase tracking-[0.12em]">Application</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const [lo, hi] = row.grades.replace("IT", "").split(" – IT").map(Number);
            const highlighted = highlightGrades.some((g) => g >= lo && g <= hi);
            return (
              <tr
                key={row.grades}
                className={`border-b border-slate-800/60 ${highlighted ? (isDark ? "bg-sky-400/10" : "bg-sky-50") : ""}`}
              >
                <td className={`py-2 pr-4 font-mono font-semibold ${highlighted ? "text-sky-300" : "text-slate-300"}`}>{row.grades}</td>
                <td className={`py-2 pr-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{row.process}</td>
                <td className={`py-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>{row.application}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GradeComparisonTable({
  nominalSize,
  fitFn,
  fitBasis,
  currentHoleGrade,
  currentShaftGrade,
  unit,
  isDark,
}: {
  nominalSize: number;
  fitFn: FitFunction;
  fitBasis: "hole-basis" | "shaft-basis";
  currentHoleGrade: number;
  currentShaftGrade: number;
  unit: UnitSystem;
  isDark: boolean;
}) {
  const gradePairs = [
    { hGrade: 6, sGrade: 5, label: "Ground / Lapped" },
    { hGrade: 7, sGrade: 6, label: "Bored / Ground" },
    { hGrade: 7, sGrade: 7, label: "Bored / Precision turned" },
    { hGrade: 8, sGrade: 7, label: "Bored / Std turned" },
    { hGrade: 8, sGrade: 8, label: "Bored / Std turned (same)" },
    { hGrade: 9, sGrade: 9, label: "Rough turned / Drilled" },
  ];

  const rows = gradePairs.map(({ hGrade, sGrade, label }) => {
    const hClass = fitBasis === "hole-basis"
      ? `${fitFn.holeLetterHB}${hGrade}`
      : `${fitFn.holeLetterSB}${hGrade}`;
    const sClass = fitBasis === "hole-basis"
      ? `${fitFn.shaftLetterHB}${sGrade}`
      : `${fitFn.shaftLetterSB}${sGrade}`;
    try {
      const calc = calculateFit({ nominalSize, holeClass: hClass, shaftClass: sClass, unit });
      return { label, hClass, sClass, calc, isCurrent: hGrade === currentHoleGrade && sGrade === currentShaftGrade };
    } catch {
      return null;
    }
  }).filter(Boolean) as Array<{ label: string; hClass: string; sClass: string; calc: FitCalculation; isCurrent: boolean }>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-slate-400">
            <th className="border-b border-slate-700/50 py-2 pr-3 font-semibold uppercase tracking-[0.12em]">Designation</th>
            <th className="border-b border-slate-700/50 py-2 pr-3 font-semibold uppercase tracking-[0.12em]">Process level</th>
            <th className="border-b border-slate-700/50 py-2 pr-3 font-semibold uppercase tracking-[0.12em]">Min clearance</th>
            <th className="border-b border-slate-700/50 py-2 pr-3 font-semibold uppercase tracking-[0.12em]">Max clearance</th>
            <th className="border-b border-slate-700/50 py-2 font-semibold uppercase tracking-[0.12em]">Fit type</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.hClass}-${row.sClass}`}
              className={`border-b border-slate-800/50 ${row.isCurrent ? (isDark ? "bg-sky-400/10" : "bg-sky-50") : ""}`}
            >
              <td className={`py-2 pr-3 font-mono font-semibold ${row.isCurrent ? "text-sky-300" : isDark ? "text-slate-200" : "text-slate-700"}`}>
                {row.hClass}/{row.sClass}
                {row.isCurrent && <span className="ml-2 text-sky-400">← current</span>}
              </td>
              <td className={`py-2 pr-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{row.label}</td>
              <td className={`py-2 pr-3 font-mono ${row.calc.minClearance >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                {formatUnit(row.calc.minClearance, unit)}
              </td>
              <td className={`py-2 pr-3 font-mono ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                {formatUnit(row.calc.maxClearance, unit)}
              </td>
              <td className={`py-2 text-xs ${
                row.calc.fitType === "Clearance fit"
                  ? "text-emerald-300"
                  : row.calc.fitType === "Interference fit"
                    ? "text-rose-300"
                    : "text-amber-300"
              }`}>
                {row.calc.fitType}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GradeZoneDiagram({ calculation }: { calculation: FitCalculation }) {
  const values = [
    calculation.hole.lowerDeviation,
    calculation.hole.upperDeviation,
    calculation.shaft.lowerDeviation,
    calculation.shaft.upperDeviation,
    0,
  ];
  const min = Math.min(...values) - 15;
  const max = Math.max(...values) + 15;
  const scale = (v: number) => 290 - ((v - min) / (max - min)) * 230;

  return (
    <svg viewBox="0 0 520 340" className="h-full min-h-[260px] w-full">
      <defs>
        <linearGradient id="gradeHole" x1="0" x2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="gradeShaft" x1="0" x2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="20" y="15" width="480" height="295" rx="8" fill="rgba(15,23,42,0.6)" stroke="rgba(148,163,184,0.18)" />
      {[-100, -50, 0, 50, 100].map((tick) => {
        const y = scale(tick);
        return (
          <g key={tick}>
            <line x1="72" x2="468" y1={y} y2={y} stroke={tick === 0 ? "#e2e8f0" : "rgba(148,163,184,0.15)"} strokeDasharray={tick === 0 ? "0" : "4 6"} />
            <text x="36" y={y + 4} fill="#94a3b8" fontSize="11" textAnchor="middle">{tick}</text>
          </g>
        );
      })}
      <text x="72" y="36" fill="#bae6fd" fontSize="12" fontWeight="600">Deviation (μm)</text>
      <ZoneBand x={150} y1={scale(calculation.hole.upperDeviation)} y2={scale(calculation.hole.lowerDeviation)} label={`Hole ${calculation.hole.designation}`} gradient="url(#gradeHole)" />
      <ZoneBand x={310} y1={scale(calculation.shaft.upperDeviation)} y2={scale(calculation.shaft.lowerDeviation)} label={`Shaft ${calculation.shaft.designation}`} gradient="url(#gradeShaft)" />
      <text x="165" y="322" fill="#cbd5e1" fontSize="11">Cmin {formatMicron(calculation.minClearance)}</text>
      <text x="310" y="322" fill="#cbd5e1" fontSize="11">Cmax {formatMicron(calculation.maxClearance)}</text>
    </svg>
  );
}

function ZoneBand({ x, y1, y2, label, gradient }: { x: number; y1: number; y2: number; label: string; gradient: string }) {
  const top = Math.min(y1, y2);
  const h = Math.max(6, Math.abs(y2 - y1));
  return (
    <g>
      <rect x={x} y={top} width="88" height={h} rx="7" fill={gradient} stroke="rgba(255,255,255,0.3)" />
      <line x1={x - 22} x2={x + 110} y1={top} y2={top} stroke="rgba(255,255,255,0.28)" />
      <line x1={x - 22} x2={x + 110} y1={top + h} y2={top + h} stroke="rgba(255,255,255,0.28)" />
      <text x={x + 44} y={top + h / 2 + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="700">{label}</text>
    </g>
  );
}

function ResultBlock({ title, items, tone }: { title: string; items: string[][]; tone: "sky" | "violet" }) {
  const border = tone === "sky" ? "border-sky-300/20" : "border-violet-300/20";
  const titleColor = tone === "sky" ? "text-sky-200" : "text-violet-200";
  return (
    <div className={`rounded-md border ${border} bg-slate-950/35 p-4`}>
      <p className={`font-semibold ${titleColor}`}>{title}</p>
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

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "sky" | "emerald" | "violet" | "rose" | "amber" }) {
  const styles: Record<string, string> = {
    sky: "border-sky-300/20 bg-sky-400/10 text-sky-100",
    emerald: "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
    violet: "border-violet-300/20 bg-violet-400/10 text-violet-100",
    rose: "border-rose-300/20 bg-rose-400/10 text-rose-100",
    amber: "border-amber-300/20 bg-amber-400/10 text-amber-100",
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

function fitTypeTone(fitType: string): "emerald" | "rose" | "amber" {
  if (fitType === "Clearance fit") return "emerald";
  if (fitType === "Interference fit") return "rose";
  return "amber";
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
