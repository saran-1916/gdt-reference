import type { ReactNode } from "react";

interface FitBasisSelectorProps {
  currentBasis: "hole-basis" | "shaft-basis";
  onBasisChange: (basis: "hole-basis" | "shaft-basis") => void;
  isDark: boolean;
}

export function FitBasisSelector({ currentBasis, onBasisChange, isDark }: FitBasisSelectorProps) {
  return (
    <div className={`rounded-lg border p-4 ${isDark ? "border-slate-700/50 bg-slate-950/30" : "border-slate-300/50 bg-slate-100"}`}>
      <h3 className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Fit System Basis</h3>
      <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        Choose which component remains fixed as the standard reference
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => onBasisChange("hole-basis")}
          className={`rounded-lg border-2 p-4 transition ${
            currentBasis === "hole-basis"
              ? isDark
                ? "border-sky-400 bg-sky-400/10"
                : "border-sky-500 bg-sky-50"
              : isDark
                ? "border-slate-600/30 bg-slate-950/50 hover:border-slate-500/50"
                : "border-slate-300 bg-white hover:border-slate-400"
          }`}
        >
          <div className="text-center">
            <div className={`text-lg font-bold ${isDark ? (currentBasis === "hole-basis" ? "text-sky-300" : "text-slate-300") : currentBasis === "hole-basis" ? "text-sky-600" : "text-slate-600"}`}>
              H (uppercase)
            </div>
            <div className={`mt-2 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Hole Basis</div>
            <div className={`mt-1 text-xs font-medium ${isDark ? "text-slate-500" : "text-slate-700"}`}>Hole fixed, shaft varies</div>
          </div>
        </button>

        <button
          onClick={() => onBasisChange("shaft-basis")}
          className={`rounded-lg border-2 p-4 transition ${
            currentBasis === "shaft-basis"
              ? isDark
                ? "border-violet-400 bg-violet-400/10"
                : "border-violet-500 bg-violet-50"
              : isDark
                ? "border-slate-600/30 bg-slate-950/50 hover:border-slate-500/50"
                : "border-slate-300 bg-white hover:border-slate-400"
          }`}
        >
          <div className="text-center">
            <div className={`text-lg font-bold ${isDark ? (currentBasis === "shaft-basis" ? "text-violet-300" : "text-slate-300") : currentBasis === "shaft-basis" ? "text-violet-600" : "text-slate-600"}`}>
              h (lowercase)
            </div>
            <div className={`mt-2 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Shaft Basis</div>
            <div className={`mt-1 text-xs font-medium ${isDark ? "text-slate-500" : "text-slate-700"}`}>Shaft fixed, hole varies</div>
          </div>
        </button>
      </div>

      <div className={`mt-4 rounded border-l-4 p-3 ${isDark ? "border-l-sky-400 bg-sky-400/5" : "border-l-sky-500 bg-sky-50"}`}>
        <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          <span className="font-semibold">Industry Note:</span> Hole Basis (H) is more common in manufacturing because it's cost-effective to use standard tooling for the hole and adjust the shaft on a CNC lathe.
        </p>
      </div>
    </div>
  );
}
