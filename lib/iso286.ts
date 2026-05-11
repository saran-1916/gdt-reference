export type UnitSystem = "mm" | "micron" | "inch";
export type FitSystem = "hole-basis" | "shaft-basis" | "custom";
export type FitType = "Clearance fit" | "Transition fit" | "Interference fit";

export type ToleranceClass = {
  letter: string;
  grade: number;
};

export type SizeRange = {
  over: number;
  to: number;
};

export type LimitSet = {
  designation: string;
  lowerDeviation: number;
  upperDeviation: number;
  minLimit: number;
  maxLimit: number;
  tolerance: number;
};

export type FitCalculationInput = {
  nominalSize: number;
  holeClass: string;
  shaftClass: string;
  unit?: UnitSystem;
  fitSystem?: FitSystem;
};

export type FitCalculation = {
  input: Required<FitCalculationInput>;
  sizeRange: SizeRange;
  meanDiameter: number;
  toleranceUnit: number;
  hole: LimitSet;
  shaft: LimitSet;
  maxClearance: number;
  minClearance: number;
  maxInterference: number;
  minInterference: number;
  fitType: FitType;
  fitLabel: string;
  recommendation: FitRecommendation;
  steps: FormulaStep[];
};

export type FormulaStep = {
  label: string;
  expression: string;
  value: string;
};

export type FitRecommendation = {
  application: string;
  holeClass: string;
  shaftClass: string;
  label: string;
  category: "Clearance" | "Transition" | "Interference";
  process: string;
  explanation: string;
};

export const sizeRanges: SizeRange[] = [
  { over: 0, to: 3 },
  { over: 3, to: 6 },
  { over: 6, to: 10 },
  { over: 10, to: 18 },
  { over: 18, to: 30 },
  { over: 30, to: 50 },
  { over: 50, to: 80 },
  { over: 80, to: 120 },
  { over: 120, to: 180 },
  { over: 180, to: 250 },
  { over: 250, to: 315 },
  { over: 315, to: 400 },
  { over: 400, to: 500 },
  { over: 500, to: 630 },
  { over: 630, to: 800 },
  { over: 800, to: 1000 },
  { over: 1000, to: 1250 },
  { over: 1250, to: 1600 },
  { over: 1600, to: 2000 },
  { over: 2000, to: 2500 },
  { over: 2500, to: 3150 },
];

export const gradeMultipliers: Record<number, number> = {
  5: 7,
  6: 10,
  7: 16,
  8: 25,
  9: 40,
  10: 64,
  11: 100,
  12: 160,
  13: 250,
  14: 400,
  15: 640,
  16: 1000,
  17: 1600,
  18: 2500,
};

export const supportedHoleLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "JS",
  "K",
  "M",
  "N",
  "P",
  "R",
  "S",
  "T",
  "U",
];

export const supportedShaftLetters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "js",
  "k",
  "m",
  "n",
  "p",
  "r",
  "s",
  "t",
  "u",
];

export const fitRecommendations: FitRecommendation[] = [
  {
    application: "Bearing fit",
    holeClass: "H7",
    shaftClass: "g6",
    label: "Precision running fit",
    category: "Clearance",
    process: "Ground shaft, bored housing",
    explanation:
      "A small reliable clearance supports accurate rotation while allowing assembly without press equipment.",
  },
  {
    application: "Gear fit",
    holeClass: "H7",
    shaftClass: "k6",
    label: "Locational transition fit",
    category: "Transition",
    process: "Reamed hub, ground shaft",
    explanation:
      "Useful where concentricity matters and the gear may need controlled assembly without a heavy shrink operation.",
  },
  {
    application: "Automotive shaft",
    holeClass: "H7",
    shaftClass: "h6",
    label: "Sliding location fit",
    category: "Clearance",
    process: "CNC bore, precision turned shaft",
    explanation:
      "Keeps the shaft guided on the nominal axis while preserving serviceable assembly clearance.",
  },
  {
    application: "Hydraulic assembly",
    holeClass: "H8",
    shaftClass: "f7",
    label: "Free running fit",
    category: "Clearance",
    process: "Honed bore, plated rod",
    explanation:
      "A broader clearance accommodates fluid film, seal behavior, temperature change, and production variation.",
  },
  {
    application: "Press fit bearing",
    holeClass: "H7",
    shaftClass: "p6",
    label: "Press fit",
    category: "Interference",
    process: "Ground journal, controlled press assembly",
    explanation:
      "Positive interference resists slip between the bearing inner ring and rotating journal.",
  },
  {
    application: "Sliding mechanism",
    holeClass: "H8",
    shaftClass: "g7",
    label: "Sliding fit",
    category: "Clearance",
    process: "Reamed guide, turned rail",
    explanation:
      "Provides guided motion with practical manufacturing cost and low risk of binding.",
  },
  {
    application: "Rotating shaft",
    holeClass: "H7",
    shaftClass: "f7",
    label: "Running fit",
    category: "Clearance",
    process: "Bored housing, turned or ground shaft",
    explanation:
      "Appropriate for moderate-speed rotation where oil film and thermal growth need allowance.",
  },
  {
    application: "Precision spindle",
    holeClass: "H6",
    shaftClass: "js5",
    label: "High accuracy transition fit",
    category: "Transition",
    process: "Jig ground bore, precision ground shaft",
    explanation:
      "Minimizes radial play for precision equipment while keeping assembly forces manageable.",
  },
  {
    application: "Keyway fit",
    holeClass: "H9",
    shaftClass: "h9",
    label: "General locating fit",
    category: "Clearance",
    process: "Milled keyway, broached hub",
    explanation:
      "A balanced general-purpose fit for keyed torque transmission where the key carries rotation load.",
  },
];

export const engineeringExamples = [
  {
    title: "Bearing Shaft Fit",
    fit: "H7/g6",
    application: "Electric motor and gearbox bearing journals",
    reason:
      "Retains accurate rotation with a measurable running clearance and controlled service assembly.",
  },
  {
    title: "Gearbox Assembly",
    fit: "H7/k6",
    application: "Gear hub located on a transmission shaft",
    reason:
      "Transition behavior improves centering while keeping the hub removable with standard shop tooling.",
  },
  {
    title: "Piston-Cylinder Fit",
    fit: "H8/f7",
    application: "Hydraulic and pneumatic sliding elements",
    reason:
      "Extra clearance supports lubrication, seal travel, and thermal expansion in reciprocating motion.",
  },
  {
    title: "Automotive Transmission Shaft",
    fit: "H7/h6",
    application: "Serviceable rotating components with accurate location",
    reason:
      "The hole-basis system reduces tooling complexity while the h shaft keeps maximum material at nominal.",
  },
  {
    title: "CNC Spindle Fit",
    fit: "H6/js5",
    application: "Precision spindle cartridges and toolholder interfaces",
    reason:
      "A narrow symmetric shaft zone supports high repeatability and low radial error.",
  },
  {
    title: "Coupling Fit",
    fit: "H7/p6",
    application: "Torque-transmitting hubs, collars, and couplings",
    reason:
      "An interference band creates holding force without relying only on keys, pins, or clamp screws.",
  },
];

export function calculateFit(input: FitCalculationInput): FitCalculation {
  const normalized: Required<FitCalculationInput> = {
    nominalSize: input.nominalSize,
    holeClass: input.holeClass || "H7",
    shaftClass: input.shaftClass || "g6",
    unit: input.unit ?? "mm",
    fitSystem: input.fitSystem ?? "hole-basis",
  };

  if (!Number.isFinite(normalized.nominalSize) || normalized.nominalSize <= 0 || normalized.nominalSize > 3150) {
    throw new Error("Nominal size must be greater than 0 mm and not exceed 3150 mm.");
  }

  const sizeRange = findSizeRange(normalized.nominalSize);
  const meanDiameter = geometricMean(sizeRange.over || 1, sizeRange.to);
  const toleranceUnit = standardToleranceUnit(meanDiameter);
  const holeClass = parseToleranceClass(normalized.holeClass, "hole");
  const shaftClass = parseToleranceClass(normalized.shaftClass, "shaft");
  const hole = buildLimitSet("hole", holeClass, normalized.nominalSize, sizeRange, toleranceUnit);
  const shaft = buildLimitSet("shaft", shaftClass, normalized.nominalSize, sizeRange, toleranceUnit);
  const maxClearance = roundMicron((hole.maxLimit - shaft.minLimit) * 1000);
  const minClearance = roundMicron((hole.minLimit - shaft.maxLimit) * 1000);
  const maxInterference = roundMicron((shaft.maxLimit - hole.minLimit) * 1000);
  const minInterference = roundMicron((shaft.minLimit - hole.maxLimit) * 1000);
  const fitType = classifyFit(minClearance, maxClearance);
  const fitLabel = classifyFitLabel(fitType, minClearance, maxClearance);
  const recommendation =
    fitRecommendations.find(
      (item) =>
        item.holeClass.toLowerCase() === normalized.holeClass.toLowerCase() &&
        item.shaftClass.toLowerCase() === normalized.shaftClass.toLowerCase(),
    ) ?? fitRecommendations[0];

  return {
    input: normalized,
    sizeRange,
    meanDiameter,
    toleranceUnit,
    hole,
    shaft,
    maxClearance,
    minClearance,
    maxInterference,
    minInterference,
    fitType,
    fitLabel,
    recommendation,
    steps: buildFormulaSteps(normalized.nominalSize, meanDiameter, toleranceUnit, hole, shaft, minClearance, maxClearance),
  };
}

export function compareFits(nominalSize: number, pairs: Array<{ holeClass: string; shaftClass: string }>) {
  return pairs.slice(0, 5).map((pair) =>
    calculateFit({
      nominalSize,
      holeClass: pair.holeClass,
      shaftClass: pair.shaftClass,
    }),
  );
}

export function parseToleranceClass(value: string, mode: "hole" | "shaft"): ToleranceClass {
  const match = value.trim().match(/^([A-Za-z]{1,2})(\d{1,2})$/);

  if (!match) {
    throw new Error(`Invalid tolerance class "${value}". Use ISO notation such as H7 or g6.`);
  }

  const letter = mode === "hole" ? match[1].toUpperCase() : match[1].toLowerCase();
  const grade = Number(match[2]);
  const allowedLetters = mode === "hole" ? supportedHoleLetters : supportedShaftLetters;

  if (!allowedLetters.includes(letter)) {
    throw new Error(`${letter} is not available in this engineering dataset yet.`);
  }

  if (grade < 1 || grade > 18) {
    throw new Error("IT grade must be between 1 and 18.");
  }

  return { letter, grade };
}

export function findSizeRange(nominalSize: number) {
  const range = sizeRanges.find((item) => nominalSize > item.over && nominalSize <= item.to);

  if (!range) {
    throw new Error("Nominal size is outside the ISO 286 supported range.");
  }

  return range;
}

export function geometricMean(over: number, to: number) {
  return Math.sqrt(over * to);
}

export function standardToleranceUnit(meanDiameter: number) {
  if (meanDiameter <= 500) {
    return 0.45 * Math.cbrt(meanDiameter) + 0.001 * meanDiameter;
  }

  return 0.004 * meanDiameter + 2.1;
}

export function toleranceWidth(grade: number, meanDiameter: number) {
  if (grade === 1) {
    return roundMicron(0.8 + 0.02 * meanDiameter);
  }

  if (grade === 2 || grade === 3 || grade === 4) {
    const it1 = 0.8 + 0.02 * meanDiameter;
    const it5 = gradeMultipliers[5] * standardToleranceUnit(meanDiameter);
    const ratio = (grade - 1) / 4;
    return roundMicron(it1 * Math.pow(it5 / it1, ratio));
  }

  return roundMicron((gradeMultipliers[grade] ?? 2500) * standardToleranceUnit(meanDiameter));
}

export function formatMicron(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded.toFixed(Math.abs(rounded) < 10 ? 1 : 0)} microns`;
}

export function micronsToUnit(value: number, unit: UnitSystem) {
  if (unit === "micron") {
    return value;
  }

  if (unit === "inch") {
    return value / 25400;
  }

  return value / 1000;
}

export function formatUnit(value: number, unit: UnitSystem) {
  const converted = micronsToUnit(value, unit);

  if (unit === "micron") {
    return `${converted.toFixed(1)} microns`;
  }

  if (unit === "inch") {
    return `${converted.toFixed(6)} in`;
  }

  return `${converted.toFixed(4)} mm`;
}

function buildLimitSet(
  mode: "hole" | "shaft",
  toleranceClass: ToleranceClass,
  nominalSize: number,
  range: SizeRange,
  toleranceUnitValue: number,
): LimitSet {
  const tolerance = toleranceWidth(toleranceClass.grade, geometricMean(range.over || 1, range.to));
  const deviations =
    mode === "hole"
      ? holeDeviations(toleranceClass.letter, toleranceClass.grade, nominalSize, tolerance)
      : shaftDeviations(toleranceClass.letter, toleranceClass.grade, nominalSize, tolerance, toleranceUnitValue);

  return {
    designation: `${toleranceClass.letter}${toleranceClass.grade}`,
    lowerDeviation: deviations.lower,
    upperDeviation: deviations.upper,
    minLimit: roundLimit(nominalSize + deviations.lower / 1000),
    maxLimit: roundLimit(nominalSize + deviations.upper / 1000),
    tolerance,
  };
}

function shaftDeviations(letter: string, grade: number, nominalSize: number, tolerance: number, toleranceUnitValue: number) {
  const lowerLetters = ["k", "m", "n", "p", "r", "s", "t", "u"];
  const nearZero = letter === "js";
  const fundamental = shaftFundamentalDeviation(letter, nominalSize, tolerance, toleranceUnitValue);

  if (letter === "h") {
    return { lower: -tolerance, upper: 0 };
  }

  if (nearZero) {
    return { lower: -tolerance / 2, upper: tolerance / 2 };
  }

  if (lowerLetters.includes(letter)) {
    return { lower: fundamental, upper: fundamental + tolerance };
  }

  return { lower: fundamental - tolerance, upper: fundamental };
}

function holeDeviations(letter: string, grade: number, nominalSize: number, tolerance: number) {
  const lowerLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const nearZero = letter === "JS";
  const pairedShaft = letter.toLowerCase();
  const shaftEquivalent = shaftFundamentalDeviation(pairedShaft, nominalSize, tolerance, 0);
  const fundamental = lowerLetters.includes(letter) ? Math.abs(shaftEquivalent) : -Math.abs(shaftEquivalent);

  if (letter === "H") {
    return { lower: 0, upper: tolerance };
  }

  if (nearZero) {
    return { lower: -tolerance / 2, upper: tolerance / 2 };
  }

  if (lowerLetters.includes(letter)) {
    return { lower: fundamental, upper: fundamental + tolerance };
  }

  return { lower: fundamental - tolerance, upper: fundamental };
}

function shaftFundamentalDeviation(letter: string, nominalSize: number, tolerance: number, toleranceUnitValue: number) {
  const d = nominalSize;

  switch (letter) {
    case "a":
      return -(d <= 120 ? 265 + 1.3 * d : 3.5 * d);
    case "b":
      return -(d <= 160 ? 140 + 0.85 * d : 1.8 * d);
    case "c":
      return -(d <= 40 ? 52 * Math.pow(d, 0.2) : 95 + 0.8 * d);
    case "d":
      return -16 * Math.pow(d, 0.44);
    case "e":
      return -11 * Math.pow(d, 0.41);
    case "f":
      return -5.5 * Math.pow(d, 0.41);
    case "g":
      return -2.5 * Math.pow(d, 0.34);
    case "h":
      return 0;
    case "js":
      return 0;
    case "k":
      return d <= 500 ? Math.max(0, 0.6 * Math.pow(d, 0.34)) : 0.35 * toleranceUnitValue;
    case "m":
      return 0.024 * d + 12.6;
    case "n":
      return 0.04 * d + 21;
    case "p":
      return 0.072 * d + 37.8;
    case "r": {
      const p = 0.072 * d + 37.8;
      const s = tolerance + 0.4 * d;
      return Math.sqrt(p * s);
    }
    case "s":
      return tolerance + 0.4 * d;
    case "t":
      return tolerance + 0.63 * d;
    case "u":
      return tolerance + d;
    default:
      return 0;
  }
}

function classifyFit(minClearance: number, maxClearance: number): FitType {
  if (minClearance > 0) {
    return "Clearance fit";
  }

  if (maxClearance < 0) {
    return "Interference fit";
  }

  return "Transition fit";
}

function classifyFitLabel(fitType: FitType, minClearance: number, maxClearance: number) {
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

function buildFormulaSteps(
  nominalSize: number,
  meanDiameter: number,
  toleranceUnit: number,
  hole: LimitSet,
  shaft: LimitSet,
  minClearance: number,
  maxClearance: number,
): FormulaStep[] {
  return [
    {
      label: "Geometric mean diameter",
      expression: "D = sqrt(lower size step x upper size step)",
      value: `${meanDiameter.toFixed(3)} mm`,
    },
    {
      label: "Standard tolerance unit",
      expression: meanDiameter <= 500 ? "i = 0.45 cube_root(D) + 0.001D" : "I = 0.004D + 2.1",
      value: `${toleranceUnit.toFixed(3)} microns`,
    },
    {
      label: "Hole limits",
      expression: `${hole.designation}: ${nominalSize} + EI/ES`,
      value: `${hole.minLimit.toFixed(4)} mm to ${hole.maxLimit.toFixed(4)} mm`,
    },
    {
      label: "Shaft limits",
      expression: `${shaft.designation}: ${nominalSize} + ei/es`,
      value: `${shaft.minLimit.toFixed(4)} mm to ${shaft.maxLimit.toFixed(4)} mm`,
    },
    {
      label: "Clearance range",
      expression: "Cmin = Hole min - Shaft max; Cmax = Hole max - Shaft min",
      value: `${formatMicron(minClearance)} to ${formatMicron(maxClearance)}`,
    },
  ];
}

function roundMicron(value: number) {
  return Math.round(value * 10) / 10;
}

function roundLimit(value: number) {
  return Math.round(value * 10000) / 10000;
}
