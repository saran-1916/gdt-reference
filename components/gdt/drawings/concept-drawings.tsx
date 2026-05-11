import { FeatureControlFrame } from "@/components/gdt/feature-control-frame";
import type { ReactNode } from "react";

type DrawingProps = {
  title: string;
  symbol: string;
  tolerance: string;
  datums?: string[];
  diameter?: boolean;
  modifier?: string;
  children: ReactNode;
};

function DrawingShell({ title, symbol, tolerance, datums, diameter, modifier, children }: DrawingProps) {
  return (
    <div className="space-y-4">
      <svg viewBox="0 0 720 390" role="img" aria-label={`${title} drawing`} className="h-auto w-full">
        <defs>
          <marker id={`${title}-arrow`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#0f172a" />
          </marker>
          <pattern id={`${title}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#dbe3ea" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="720" height="390" rx="8" fill="#f8fafc" />
        <rect x="28" y="28" width="664" height="334" fill={`url(#${title}-grid)`} opacity="0.55" />
        {children}
      </svg>
      <FeatureControlFrame symbol={symbol} tolerance={tolerance} datums={datums} diameter={diameter} modifier={modifier} />
    </div>
  );
}

export function TruePositionDrawing() {
  return (
    <DrawingShell title="position" symbol="\u2316" tolerance="0.20" diameter modifier="M" datums={["A", "B", "C"]}>
      <rect x="86" y="80" width="320" height="210" rx="10" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <circle cx="188" cy="166" r="34" fill="#fff" stroke="#0f172a" strokeWidth="4" />
      <circle cx="304" cy="166" r="34" fill="#fff" stroke="#0f172a" strokeWidth="4" />
      <circle cx="188" cy="166" r="18" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="7 7" />
      <circle cx="304" cy="166" r="18" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="7 7" />
      <line x1="188" y1="54" x2="188" y2="306" stroke="#64748b" strokeDasharray="8 8" />
      <line x1="304" y1="54" x2="304" y2="306" stroke="#64748b" strokeDasharray="8 8" />
      <line x1="56" y1="166" x2="430" y2="166" stroke="#64748b" strokeDasharray="8 8" />
      <rect x="586" y="92" width="76" height="54" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="624" y="127" textAnchor="middle" fontSize="24" fontFamily="monospace" fill="#0f172a">A</text>
      <rect x="92" y="290" width="58" height="44" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="121" y="319" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">B</text>
      <rect x="406" y="110" width="44" height="58" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="428" y="147" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">C</text>
      <text x="512" y="230" fontSize="15" fill="#475569">Green zones show allowable</text>
      <text x="512" y="252" fontSize="15" fill="#475569">axis location at each hole.</text>
    </DrawingShell>
  );
}

export function FlatnessDrawing() {
  return (
    <DrawingShell title="flatness" symbol="\u23e5" tolerance="0.08">
      <path d="M88 248 L422 248 L530 190 L200 190 Z" fill="#d9e2ea" stroke="#0f172a" strokeWidth="3" />
      <path d="M200 190 C260 178 310 207 365 194 C420 181 473 189 530 190" fill="none" stroke="#ef4444" strokeWidth="4" />
      <path d="M144 118 L574 118" stroke="#10b981" strokeWidth="3" strokeDasharray="10 8" />
      <path d="M144 154 L574 154" stroke="#10b981" strokeWidth="3" strokeDasharray="10 8" />
      <line x1="594" y1="118" x2="594" y2="154" stroke="#0f172a" markerStart="url(#flatness-arrow)" markerEnd="url(#flatness-arrow)" />
      <text x="612" y="141" fontSize="18" fontFamily="monospace" fill="#0f172a">0.08</text>
      <text x="112" y="322" fontSize="15" fill="#475569">The red surface must fit between the two green planes.</text>
    </DrawingShell>
  );
}

export function SymmetryDrawing() {
  return (
    <DrawingShell title="symmetry" symbol="\u232f" tolerance="0.10" datums={["A"]}>
      <rect x="84" y="92" width="360" height="190" rx="8" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <rect x="208" y="92" width="112" height="190" fill="#fff" stroke="#0f172a" strokeWidth="3" />
      <line x1="264" y1="62" x2="264" y2="318" stroke="#0f172a" strokeWidth="3" strokeDasharray="10 7" />
      <line x1="238" y1="62" x2="238" y2="318" stroke="#10b981" strokeWidth="3" strokeDasharray="8 7" />
      <line x1="290" y1="62" x2="290" y2="318" stroke="#10b981" strokeWidth="3" strokeDasharray="8 7" />
      <circle cx="260" cy="132" r="5" fill="#ef4444" />
      <circle cx="267" cy="178" r="5" fill="#ef4444" />
      <circle cx="258" cy="232" r="5" fill="#ef4444" />
      <rect x="486" y="122" width="76" height="54" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="524" y="157" textAnchor="middle" fontSize="24" fontFamily="monospace" fill="#0f172a">A</text>
      <text x="470" y="242" fontSize="15" fill="#475569">Red points are calculated</text>
      <text x="470" y="264" fontSize="15" fill="#475569">midpoints between faces.</text>
    </DrawingShell>
  );
}

export function DatumDrawing() {
  return (
    <DrawingShell title="datum" symbol="A" tolerance="DATUM">
      <path d="M110 260 L438 260 L525 205 L198 205 Z" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <path d="M198 205 L198 115 L525 115 L525 205" fill="#d9e2ea" stroke="#0f172a" strokeWidth="3" />
      <line x1="112" y1="292" x2="528" y2="292" stroke="#10b981" strokeWidth="5" />
      <path d="M356 205 L535 118" stroke="#0f172a" strokeWidth="2" markerEnd="url(#datum-arrow)" />
      <rect x="552" y="76" width="76" height="54" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="590" y="111" textAnchor="middle" fontSize="24" fontFamily="monospace" fill="#0f172a">A</text>
      <text x="110" y="330" fontSize="15" fill="#475569">Datum feature A is the real surface used to simulate the exact datum plane.</text>
    </DrawingShell>
  );
}

export function StraightnessDrawing() {
  return (
    <DrawingShell title="straightness" symbol="\u23e4" tolerance="0.05">
      <path d="M92 240 L550 240" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
      <path d="M112 194 C192 175 272 218 356 195 C436 174 484 202 550 186" fill="none" stroke="#ef4444" strokeWidth="4" />
      <path d="M105 168 L575 168" stroke="#10b981" strokeWidth="3" strokeDasharray="10 8" />
      <path d="M105 220 L575 220" stroke="#10b981" strokeWidth="3" strokeDasharray="10 8" />
      <line x1="604" y1="168" x2="604" y2="220" stroke="#0f172a" markerStart="url(#straightness-arrow)" markerEnd="url(#straightness-arrow)" />
      <text x="622" y="199" fontSize="18" fontFamily="monospace" fill="#0f172a">0.05</text>
      <text x="110" y="306" fontSize="15" fill="#475569">A sampled line element must remain between the two straight boundaries.</text>
    </DrawingShell>
  );
}

export function AngularityDrawing() {
  return (
    <DrawingShell title="angularity" symbol="\u2220" tolerance="0.20" datums={["A"]}>
      <rect x="100" y="270" width="460" height="34" fill="#d9e2ea" stroke="#0f172a" strokeWidth="3" />
      <line x1="92" y1="322" x2="578" y2="322" stroke="#10b981" strokeWidth="5" />
      <path d="M234 270 L470 120 L498 158 L262 304 Z" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <path d="M240 229 L502 62" stroke="#10b981" strokeWidth="3" strokeDasharray="10 8" />
      <path d="M270 276 L532 108" stroke="#10b981" strokeWidth="3" strokeDasharray="10 8" />
      <path d="M125 270 A105 105 0 0 1 213 214" fill="none" stroke="#0f172a" strokeWidth="2" />
      <text x="160" y="250" fontSize="18" fontFamily="monospace" fill="#0f172a">30 BASIC</text>
      <rect x="586" y="272" width="58" height="44" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="615" y="301" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">A</text>
    </DrawingShell>
  );
}

export function PerpendicularityDrawing() {
  return (
    <DrawingShell title="perpendicularity" symbol="\u27c2" tolerance="0.10" diameter modifier="M" datums={["A"]}>
      <rect x="118" y="268" width="460" height="32" fill="#d9e2ea" stroke="#0f172a" strokeWidth="3" />
      <line x1="114" y1="318" x2="582" y2="318" stroke="#10b981" strokeWidth="5" />
      <rect x="308" y="96" width="78" height="172" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <line x1="347" y1="74" x2="347" y2="288" stroke="#ef4444" strokeWidth="4" />
      <line x1="315" y1="74" x2="315" y2="288" stroke="#10b981" strokeWidth="3" strokeDasharray="9 7" />
      <line x1="379" y1="74" x2="379" y2="288" stroke="#10b981" strokeWidth="3" strokeDasharray="9 7" />
      <rect x="600" y="272" width="58" height="44" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="629" y="301" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">A</text>
    </DrawingShell>
  );
}

export function ProfileSurfaceDrawing() {
  return (
    <DrawingShell title="profile" symbol="\u2312" tolerance="0.30" datums={["A", "B"]}>
      <path d="M110 256 C172 118 266 102 354 184 C438 264 508 220 594 108" fill="none" stroke="#0f172a" strokeWidth="24" strokeLinecap="round" />
      <path d="M110 229 C172 91 266 75 354 157 C438 237 508 193 594 81" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="9 8" />
      <path d="M110 283 C172 145 266 129 354 211 C438 291 508 247 594 135" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="9 8" />
      <circle cx="278" cy="139" r="6" fill="#ef4444" />
      <circle cx="432" cy="240" r="6" fill="#ef4444" />
      <rect x="94" y="304" width="58" height="44" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="123" y="333" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">A</text>
      <rect x="548" y="304" width="58" height="44" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="577" y="333" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">B</text>
    </DrawingShell>
  );
}

export function MmcDrawing() {
  return (
    <DrawingShell title="mmc" symbol="\u2316" tolerance="0.20" diameter modifier="M" datums={["A", "B", "C"]}>
      <rect x="94" y="106" width="222" height="172" rx="8" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <circle cx="205" cy="192" r="50" fill="#fff" stroke="#0f172a" strokeWidth="4" />
      <circle cx="205" cy="192" r="38" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="8 7" />
      <rect x="420" y="106" width="92" height="172" rx="46" fill="#d9e2ea" stroke="#0f172a" strokeWidth="3" />
      <rect x="406" y="92" width="120" height="200" rx="60" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="8 7" />
      <text x="123" y="322" fontSize="15" fill="#475569">Hole MMC = smallest hole</text>
      <text x="414" y="322" fontSize="15" fill="#475569">Pin MMC = largest pin</text>
    </DrawingShell>
  );
}

export function ConcentricityDrawing() {
  return (
    <DrawingShell title="concentricity" symbol="\u25ce" tolerance="0.05" datums={["A"]}>
      <rect x="92" y="172" width="500" height="78" rx="39" fill="#d9e2ea" stroke="#0f172a" strokeWidth="3" />
      <circle cx="184" cy="211" r="64" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <circle cx="454" cy="211" r="46" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <line x1="92" y1="211" x2="592" y2="211" stroke="#0f172a" strokeWidth="3" strokeDasharray="10 8" />
      <circle cx="450" cy="207" r="20" fill="none" stroke="#10b981" strokeWidth="3" />
      <circle cx="443" cy="212" r="4" fill="#ef4444" />
      <circle cx="458" cy="205" r="4" fill="#ef4444" />
      <circle cx="452" cy="218" r="4" fill="#ef4444" />
      <rect x="146" y="294" width="58" height="44" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="175" y="323" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">A</text>
    </DrawingShell>
  );
}

export function RunoutDrawing() {
  return (
    <DrawingShell title="runout" symbol="\u2197" tolerance="0.03" datums={["A"]}>
      <rect x="120" y="178" width="430" height="70" rx="35" fill="#d9e2ea" stroke="#0f172a" strokeWidth="3" />
      <circle cx="190" cy="213" r="58" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <circle cx="470" cy="213" r="42" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <path d="M470 143 A70 70 0 1 1 469 143" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="9 7" />
      <path d="M470 74 V153" stroke="#0f172a" strokeWidth="3" markerEnd="url(#runout-arrow)" />
      <rect x="452" y="42" width="36" height="26" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="112" y="312" fontSize="15" fill="#475569">Rotate about datum A and read total indicator movement on the surface.</text>
      <rect x="158" y="294" width="58" height="44" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="187" y="323" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">A</text>
    </DrawingShell>
  );
}

export function ParallelismDrawing() {
  return (
    <DrawingShell title="parallelism" symbol="\u2225" tolerance="0.10" datums={["A"]}>
      <path d="M112 266 L498 266 L580 220 L194 220 Z" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <path d="M194 220 L194 120 L580 120 L580 220" fill="#d9e2ea" stroke="#0f172a" strokeWidth="3" />
      <line x1="116" y1="312" x2="590" y2="312" stroke="#10b981" strokeWidth="5" />
      <path d="M182 86 L590 86" stroke="#10b981" strokeWidth="3" strokeDasharray="9 7" />
      <path d="M182 118 L590 118" stroke="#10b981" strokeWidth="3" strokeDasharray="9 7" />
      <rect x="606" y="290" width="58" height="44" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      <text x="635" y="319" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#0f172a">A</text>
    </DrawingShell>
  );
}

export function CircularityDrawing() {
  return (
    <DrawingShell title="circularity" symbol="\u25cb" tolerance="0.04">
      <circle cx="332" cy="196" r="106" fill="#e8eef3" stroke="#0f172a" strokeWidth="3" />
      <path d="M332 94 C370 102 432 128 432 190 C432 254 372 292 326 288 C270 284 228 240 232 188 C236 136 282 86 332 94 Z" fill="#d9e2ea" stroke="#ef4444" strokeWidth="4" />
      <circle cx="332" cy="196" r="86" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="9 7" />
      <circle cx="332" cy="196" r="118" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="9 7" />
      <text x="116" y="320" fontSize="15" fill="#475569">Every point in this cross-section must fit between two concentric circles.</text>
    </DrawingShell>
  );
}
