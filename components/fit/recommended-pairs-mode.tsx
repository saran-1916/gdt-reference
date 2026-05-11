import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateFit, fitRecommendations, formatMicron, formatUnit, type FitCalculation, type UnitSystem } from "@/lib/iso286";

interface RecommendedPairsModeProps {
  nominalSize: number;
  onNominalSizeChange: (size: number) => void;
  selectedFit: string;
  onFitChange: (fit: string) => void;
  unit: UnitSystem;
  isDark: boolean;
  fitBasis: "hole-basis" | "shaft-basis";
}

export function RecommendedPairsMode({
  nominalSize,
  onNominalSizeChange,
  selectedFit,
  onFitChange,
  unit,
  isDark,
  fitBasis,
}: RecommendedPairsModeProps) {
  // Get all unique fit pairs in a nice format
  const fitPairs = useMemo(() => {
    const pairs = fitRecommendations.reduce(
      (acc, rec) => {
        const pairKey = `${rec.holeClass}/${rec.shaftClass}`;
        const existing = acc.find((p) => p.key === pairKey);
        if (!existing) {
          acc.push({
            key: pairKey,
            holeClass: rec.holeClass,
            shaftClass: rec.shaftClass,
            label: `${pairKey} - ${rec.label}`,
            category: rec.category,
          });
        }
        return acc;
      },
      [] as Array<{
        key: string;
        holeClass: string;
        shaftClass: string;
        label: string;
        category: string;
      }>,
    );
    return pairs.sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // Parse selected fit into hole and shaft classes
  const [holeClass, shaftClass] = selectedFit.split("/") || ["H7", "g6"];

  const calculation = useMemo(() => {
    try {
      return calculateFit({ nominalSize, holeClass, shaftClass, unit });
    } catch {
      return calculateFit({ nominalSize: 50, holeClass: "H7", shaftClass: "g6", unit });
    }
  }, [nominalSize, holeClass, shaftClass, unit]);

  const recommendation = fitRecommendations.find(
    (r) => r.holeClass === holeClass && r.shaftClass === shaftClass,
  );

  const inputClass = isDark
    ? "h-11 w-full rounded-md border border-slate-700 bg-slate-950/60 text-slate-100 px-3 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-400/20"
    : "h-11 w-full rounded-md border border-slate-300 bg-white text-slate-950 px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20";

  const panelClass = isDark
    ? "border-white/10 bg-white/[0.06] text-slate-100 shadow-xl shadow-slate-950/20 backdrop-blur"
    : "border-slate-200 bg-white text-slate-950";

  return (
    <div className="space-y-5">
      <Card className={`border-white/10 bg-white/[0.06] text-slate-100 shadow-xl shadow-slate-950/20 backdrop-blur`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md border border-sky-300/20 bg-sky-400/10 text-sky-200">
              <BarChart3 className="h-5 w-5" />
            </div>
            <CardTitle>Quick Fit Selection</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Nominal Size (mm)</span>
              <input
                type="number"
                value={nominalSize}
                onChange={(e) => onNominalSizeChange(Number(e.target.value))}
                min="0.001"
                max="3150"
                step="0.001"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Select Fit Pair</span>
              <select
                value={selectedFit}
                onChange={(e) => onFitChange(e.target.value)}
                className={inputClass}
              >
                {fitPairs.map((pair) => (
                  <option key={pair.key} value={pair.key}>
                    {pair.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">System Basis</span>
              <div className="text-sm text-slate-400">
                {fitBasis === "hole-basis" ? "Hole Basis (H)" : "Shaft Basis (h)"}
              </div>
            </label>
          </div>

          {recommendation && (
            <div className="rounded-md border border-sky-300/20 bg-sky-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-sky-200">Application</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{recommendation.explanation}</p>
              <p className="mt-3 text-xs text-slate-400">{recommendation.process}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={`border-white/10 bg-white/[0.06] text-slate-100 shadow-xl shadow-slate-950/20 backdrop-blur`}>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md border border-sky-300/20 bg-sky-400/10 text-sky-200">
                <BarChart3 className="h-5 w-5" />
              </div>
              <CardTitle>Fit Results</CardTitle>
            </div>
            <Badge className="border border-sky-300/20 bg-sky-400/10 text-sky-200">{calculation.fitType}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-slate-700/60 bg-slate-950/35 p-4">
              <p className="font-semibold text-slate-100">Hole {calculation.hole.designation}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-400">ES (Upper Dev)</span>
                  <span className="font-mono text-slate-100">{formatMicron(calculation.hole.upperDeviation)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-400">EI (Lower Dev)</span>
                  <span className="font-mono text-slate-100">{formatMicron(calculation.hole.lowerDeviation)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-400">Max Size</span>
                  <span className="font-mono text-slate-100">{calculation.hole.maxLimit.toFixed(4)} mm</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-400">Min Size</span>
                  <span className="font-mono text-slate-100">{calculation.hole.minLimit.toFixed(4)} mm</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-slate-700/60 bg-slate-950/35 p-4">
              <p className="font-semibold text-slate-100">Shaft {calculation.shaft.designation}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-400">es (Upper Dev)</span>
                  <span className="font-mono text-slate-100">{formatMicron(calculation.shaft.upperDeviation)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-400">ei (Lower Dev)</span>
                  <span className="font-mono text-slate-100">{formatMicron(calculation.shaft.lowerDeviation)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-400">Max Size</span>
                  <span className="font-mono text-slate-100">{calculation.shaft.maxLimit.toFixed(4)} mm</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-400">Min Size</span>
                  <span className="font-mono text-slate-100">{calculation.shaft.minLimit.toFixed(4)} mm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-emerald-300/20 bg-emerald-400/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70 text-emerald-100">Min Clearance</p>
              <p className="mt-2 text-lg font-semibold text-emerald-200">{formatUnit(calculation.minClearance, unit)}</p>
            </div>
            <div className="rounded-md border border-sky-300/20 bg-sky-400/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70 text-sky-100">Max Clearance</p>
              <p className="mt-2 text-lg font-semibold text-sky-200">{formatUnit(calculation.maxClearance, unit)}</p>
            </div>
            <div className="rounded-md border border-rose-300/20 bg-rose-400/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70 text-rose-100">Max Interference</p>
              <p className="mt-2 text-lg font-semibold text-rose-200">{formatUnit(Math.max(0, calculation.maxInterference), unit)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
