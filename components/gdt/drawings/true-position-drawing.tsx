import { FeatureControlFrame } from "@/components/gdt/feature-control-frame";

export function TruePositionDrawing() {
  return (
    <div className="space-y-4">
      <svg viewBox="0 0 720 390" role="img" aria-label="True position drawing" className="h-auto w-full">
        <defs>
          <pattern id="grid-position" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#dbe3ea" strokeWidth="1" />
          </pattern>
          <marker id="arrow-position" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#0f172a" />
          </marker>
        </defs>
        <rect width="720" height="390" rx="8" fill="#f8fafc" />
        <rect x="28" y="28" width="410" height="300" fill="url(#grid-position)" stroke="#cbd5e1" />
        <rect x="84" y="72" width="300" height="210" rx="10" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
        <circle cx="180" cy="160" r="34" fill="#fff" stroke="#0f172a" strokeWidth="4" />
        <circle cx="288" cy="160" r="34" fill="#fff" stroke="#0f172a" strokeWidth="4" />
        <circle cx="180" cy="160" r="17" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="7 7" />
        <circle cx="288" cy="160" r="17" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="7 7" />
        <line x1="180" y1="50" x2="180" y2="300" stroke="#64748b" strokeDasharray="8 8" />
        <line x1="288" y1="50" x2="288" y2="300" stroke="#64748b" strokeDasharray="8 8" />
        <line x1="56" y1="160" x2="410" y2="160" stroke="#64748b" strokeDasharray="8 8" />
        <line x1="84" y1="308" x2="384" y2="308" stroke="#0f172a" markerEnd="url(#arrow-position)" markerStart="url(#arrow-position)" />
        <text x="220" y="340" textAnchor="middle" fontSize="18" fontFamily="monospace" fill="#0f172a">120 BASIC</text>
        <line x1="54" y1="72" x2="54" y2="282" stroke="#0f172a" markerEnd="url(#arrow-position)" markerStart="url(#arrow-position)" />
        <text x="34" y="184" textAnchor="middle" fontSize="18" fontFamily="monospace" fill="#0f172a" transform="rotate(-90 34 184)">80 BASIC</text>
        <path d="M438 160 H555" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow-position)" />
        <rect x="580" y="85" width="94" height="62" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        <text x="627" y="122" textAnchor="middle" fontSize="24" fontFamily="monospace" fill="#0f172a">A</text>
        <rect x="86" y="282" width="86" height="42" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        <text x="129" y="310" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">B</text>
        <rect x="384" y="96" width="42" height="86" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        <text x="405" y="147" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">C</text>
        <text x="560" y="214" fontSize="15" fill="#475569">Dashed green circles show</text>
        <text x="560" y="236" fontSize="15" fill="#475569">the Ø tolerance zones.</text>
      </svg>
      <FeatureControlFrame symbol="⌖" tolerance="0.20" diameter modifier="M" datums={["A", "B", "C"]} />
    </div>
  );
}
