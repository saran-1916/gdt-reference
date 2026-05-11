import { FeatureControlFrame } from "@/components/gdt/feature-control-frame";

export function FlatnessDrawing() {
  return (
    <div className="space-y-4">
      <svg viewBox="0 0 720 390" role="img" aria-label="Flatness drawing" className="h-auto w-full">
        <defs>
          <marker id="arrow-flatness" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#0f172a" />
          </marker>
        </defs>
        <rect width="720" height="390" rx="8" fill="#f8fafc" />
        <path d="M88 248 L422 248 L530 190 L200 190 Z" fill="#d9e2ea" stroke="#0f172a" strokeWidth="3" />
        <path d="M200 190 C260 178 310 207 365 194 C420 181 473 189 530 190" fill="none" stroke="#ef4444" strokeWidth="4" />
        <path d="M88 248 L200 190" stroke="#0f172a" strokeWidth="3" />
        <path d="M422 248 L530 190" stroke="#0f172a" strokeWidth="3" />
        <path d="M144 118 L574 118" stroke="#10b981" strokeWidth="3" strokeDasharray="10 8" />
        <path d="M144 154 L574 154" stroke="#10b981" strokeWidth="3" strokeDasharray="10 8" />
        <line x1="594" y1="118" x2="594" y2="154" stroke="#0f172a" markerStart="url(#arrow-flatness)" markerEnd="url(#arrow-flatness)" />
        <text x="612" y="141" fontSize="18" fontFamily="monospace" fill="#0f172a">0.08</text>
        <path d="M390 188 H540" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow-flatness)" />
        <text x="112" y="308" fontSize="15" fill="#475569">The red surface must fit between the two green planes.</text>
        <text x="112" y="332" fontSize="15" fill="#475569">No datum is referenced, so tilt is not evaluated here.</text>
      </svg>
      <FeatureControlFrame symbol="▱" tolerance="0.08" />
    </div>
  );
}
