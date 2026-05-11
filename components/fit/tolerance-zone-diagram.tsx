import type { FitCalculation } from "@/lib/iso286";

interface ToleranceZoneDiagramProps {
  calculation: FitCalculation;
  isDark: boolean;
}

export function ToleranceZoneDiagram({ calculation, isDark }: ToleranceZoneDiagramProps) {
  const { hole, shaft, minClearance, maxClearance } = calculation;

  // Calculate positions for SVG
  const nominalY = 200;
  const scale = 2; // pixels per micron

  const holeUpperY = nominalY - hole.upperDeviation * scale;
  const holeLowerY = nominalY - hole.lowerDeviation * scale;
  const shaftUpperY = nominalY - shaft.upperDeviation * scale;
  const shaftLowerY = nominalY - shaft.lowerDeviation * scale;

  return (
    <div className={`rounded-lg border p-6 ${isDark ? "border-slate-700/50 bg-slate-950/30" : "border-slate-300/50 bg-slate-100"}`}>
      <h3 className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Tolerance Zone Visualization</h3>
      <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Graphical representation of hole and shaft tolerance zones relative to nominal size</p>

      <div className="mt-6 overflow-x-auto">
        <svg viewBox="0 0 800 300" className={`w-full ${isDark ? "bg-slate-950/50" : "bg-white"}`} style={{ minHeight: "250px", backgroundColor: isDark ? "rgba(15, 23, 42, 0.5)" : "white" }}>
          <defs>
            <pattern id="holePattern" patternUnits="userSpaceOnUse" width="8" height="8">
              <rect width="8" height="8" fill={isDark ? "rgba(56, 189, 248, 0.1)" : "rgba(59, 130, 246, 0.1)"} />
              <circle cx="4" cy="4" r="2" fill={isDark ? "rgba(56, 189, 248, 0.3)" : "rgba(59, 130, 246, 0.3)"} />
            </pattern>
            <pattern id="shaftPattern" patternUnits="userSpaceOnUse" width="8" height="8">
              <rect width="8" height="8" fill={isDark ? "rgba(167, 139, 250, 0.1)" : "rgba(168, 85, 247, 0.1)"} />
              <circle cx="4" cy="4" r="2" fill={isDark ? "rgba(167, 139, 250, 0.3)" : "rgba(168, 85, 247, 0.3)"} />
            </pattern>
          </defs>

          {/* Grid background */}
          <g opacity="0.1">
            {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800].map((x) => (
              <line key={`vline-${x}`} x1={x} y1="50" x2={x} y2="250" stroke={isDark ? "#94a3b8" : "#cbd5e1"} strokeWidth="0.5" />
            ))}
            {[50, 100, 150, 200, 250].map((y) => (
              <line key={`hline-${y}`} x1="50" y1={y} x2="750" y2={y} stroke={isDark ? "#94a3b8" : "#cbd5e1"} strokeWidth="0.5" />
            ))}
          </g>

          {/* Nominal zero line */}
          <line x1="50" y1={nominalY} x2="750" y2={nominalY} stroke={isDark ? "#64748b" : "#94a3b8"} strokeWidth="2" strokeDasharray="5,5" />
          <text x="20" y={nominalY + 5} fontSize="12" fill={isDark ? "#94a3b8" : "#475569"} fontWeight="600">
            0
          </text>

          {/* Hole tolerance zone */}
          <g>
            <rect x="80" y={Math.min(holeUpperY, holeLowerY)} width="150" height={Math.abs(holeLowerY - holeUpperY)} fill="url(#holePattern)" stroke={isDark ? "#38bdf8" : "#3b82f6"} strokeWidth="2" />
            <line x1="80" y1={holeUpperY} x2="230" y2={holeUpperY} stroke={isDark ? "#06b6d4" : "#0284c7"} strokeWidth="1" />
            <line x1="80" y1={holeLowerY} x2="230" y2={holeLowerY} stroke={isDark ? "#06b6d4" : "#0284c7"} strokeWidth="1" />

            <text x="155" y={Math.min(holeUpperY, holeLowerY) - 10} fontSize="12" fontWeight="600" fill={isDark ? "#38bdf8" : "#3b82f6"} textAnchor="middle">
              HOLE {hole.designation}
            </text>

            {/* Deviation labels for hole */}
            <text x="245" y={holeUpperY + 5} fontSize="11" fill={isDark ? "#bae6fd" : "#0284c7"} fontWeight="600">
              ES: {hole.upperDeviation.toFixed(0)} µm
            </text>
            <text x="245" y={holeLowerY + 5} fontSize="11" fill={isDark ? "#bae6fd" : "#0284c7"} fontWeight="600">
              EI: {hole.lowerDeviation.toFixed(0)} µm
            </text>
          </g>

          {/* Shaft tolerance zone */}
          <g>
            <rect x="400" y={Math.min(shaftUpperY, shaftLowerY)} width="150" height={Math.abs(shaftLowerY - shaftUpperY)} fill="url(#shaftPattern)" stroke={isDark ? "#a78bfa" : "#a855f7"} strokeWidth="2" />
            <line x1="400" y1={shaftUpperY} x2="550" y2={shaftUpperY} stroke={isDark ? "#c084fc" : "#9333ea"} strokeWidth="1" />
            <line x1="400" y1={shaftLowerY} x2="550" y2={shaftLowerY} stroke={isDark ? "#c084fc" : "#9333ea"} strokeWidth="1" />

            <text x="475" y={Math.min(shaftUpperY, shaftLowerY) - 10} fontSize="12" fontWeight="600" fill={isDark ? "#a78bfa" : "#a855f7"} textAnchor="middle">
              SHAFT {shaft.designation}
            </text>

            {/* Deviation labels for shaft */}
            <text x="565" y={shaftUpperY + 5} fontSize="11" fill={isDark ? "#d8b4fe" : "#9333ea"} fontWeight="600">
              es: {shaft.upperDeviation.toFixed(0)} µm
            </text>
            <text x="565" y={shaftLowerY + 5} fontSize="11" fill={isDark ? "#d8b4fe" : "#9333ea"} fontWeight="600">
              ei: {shaft.lowerDeviation.toFixed(0)} µm
            </text>
          </g>

          {/* Clearance zone indicator */}
          <g opacity="0.7">
            <line x1="310" y1={holeLowerY} x2="390" y2={shaftUpperY} stroke={isDark ? "#34d399" : "#10b981"} strokeWidth="2" strokeDasharray="3,3" />
            <text x="350" y={Math.min(holeLowerY, shaftUpperY) - 5} fontSize="10" fill={isDark ? "#34d399" : "#10b981"} fontWeight="600" textAnchor="middle">
              Clearance Range
            </text>
          </g>

          {/* Axis labels */}
          <text x="400" y="280" fontSize="11" fill={isDark ? "#64748b" : "#94a3b8"} textAnchor="middle" fontWeight="600">
            Deviation from Nominal Size (µm)
          </text>
        </svg>
      </div>

      {/* Legend and explanation */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className={`rounded p-3 ${isDark ? "bg-sky-400/10" : "bg-sky-50"}`}>
          <p className={`text-xs font-semibold ${isDark ? "text-sky-300" : "text-sky-700"}`}>Hole Tolerance Zone</p>
          <p className={`mt-1 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>The allowable range for the hole diameter, shown in light blue with dotted pattern</p>
        </div>
        <div className={`rounded p-3 ${isDark ? "bg-violet-400/10" : "bg-violet-50"}`}>
          <p className={`text-xs font-semibold ${isDark ? "text-violet-300" : "text-violet-700"}`}>Shaft Tolerance Zone</p>
          <p className={`mt-1 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>The allowable range for the shaft diameter, shown in purple with dotted pattern</p>
        </div>
        <div className={`rounded p-3 ${isDark ? "bg-emerald-400/10" : "bg-emerald-50"}`}>
          <p className={`text-xs font-semibold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>Clearance Range</p>
          <p className={`mt-1 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>Gap between min hole and max shaft (min: {minClearance.toFixed(0)}, max: {maxClearance.toFixed(0)} µm)</p>
        </div>
      </div>
    </div>
  );
}
