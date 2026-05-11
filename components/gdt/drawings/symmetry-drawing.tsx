import { FeatureControlFrame } from "@/components/gdt/feature-control-frame";

export function SymmetryDrawing() {
  return (
    <div className="space-y-4">
      <svg viewBox="0 0 720 390" role="img" aria-label="Symmetry drawing" className="h-auto w-full">
        <defs>
          <marker id="arrow-symmetry" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#0f172a" />
          </marker>
        </defs>
        <rect width="720" height="390" rx="8" fill="#f8fafc" />
        <rect x="84" y="92" width="360" height="190" rx="8" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
        <rect x="208" y="92" width="112" height="190" fill="#fff" stroke="#0f172a" strokeWidth="3" />
        <line x1="264" y1="62" x2="264" y2="318" stroke="#0f172a" strokeWidth="3" strokeDasharray="10 7" />
        <line x1="238" y1="62" x2="238" y2="318" stroke="#10b981" strokeWidth="3" strokeDasharray="8 7" />
        <line x1="290" y1="62" x2="290" y2="318" stroke="#10b981" strokeWidth="3" strokeDasharray="8 7" />
        <circle cx="260" cy="132" r="5" fill="#ef4444" />
        <circle cx="267" cy="178" r="5" fill="#ef4444" />
        <circle cx="258" cy="232" r="5" fill="#ef4444" />
        <line x1="208" y1="132" x2="260" y2="132" stroke="#ef4444" strokeWidth="2" />
        <line x1="320" y1="132" x2="260" y2="132" stroke="#ef4444" strokeWidth="2" />
        <line x1="208" y1="178" x2="267" y2="178" stroke="#ef4444" strokeWidth="2" />
        <line x1="320" y1="178" x2="267" y2="178" stroke="#ef4444" strokeWidth="2" />
        <line x1="208" y1="232" x2="258" y2="232" stroke="#ef4444" strokeWidth="2" />
        <line x1="320" y1="232" x2="258" y2="232" stroke="#ef4444" strokeWidth="2" />
        <line x1="238" y1="336" x2="290" y2="336" stroke="#0f172a" markerStart="url(#arrow-symmetry)" markerEnd="url(#arrow-symmetry)" />
        <text x="246" y="365" fontSize="18" fontFamily="monospace" fill="#0f172a">0.10</text>
        <rect x="486" y="122" width="92" height="62" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        <text x="532" y="160" textAnchor="middle" fontSize="24" fontFamily="monospace" fill="#0f172a">A</text>
        <path d="M486 153 H445" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow-symmetry)" />
        <text x="470" y="228" fontSize="15" fill="#475569">Red points are calculated</text>
        <text x="470" y="250" fontSize="15" fill="#475569">midpoints between faces.</text>
      </svg>
      <FeatureControlFrame symbol="⌯" tolerance="0.10" datums={["A"]} />
    </div>
  );
}
