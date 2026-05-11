import type { ComponentType } from "react";
import {
  AngularityDrawing,
  CircularityDrawing,
  ConcentricityDrawing,
  DatumDrawing,
  FlatnessDrawing,
  MmcDrawing,
  ParallelismDrawing,
  PerpendicularityDrawing,
  ProfileSurfaceDrawing,
  RunoutDrawing,
  StraightnessDrawing,
  SymmetryDrawing,
  TruePositionDrawing,
} from "@/components/gdt/drawings/concept-drawings";

export type GdtCategory =
  | "Datum"
  | "Dimension"
  | "Form"
  | "Location"
  | "Material"
  | "Orientation"
  | "Profile"
  | "Reference"
  | "Runout";

export type ExampleStep = {
  label: string;
  value: string;
  note: string;
};

export type SceneType =
  | "position"
  | "flatness"
  | "symmetry"
  | "straightness"
  | "orientation"
  | "profile"
  | "material"
  | "concentricity"
  | "runout"
  | "circularity"
  | "datum";

export type GdtPage = {
  slug: string;
  name: string;
  formalName: string;
  symbol: string;
  category: GdtCategory;
  summary: string;
  relativeToDatum: string;
  materialModifiers: string;
  toleranceZone: string;
  drawingTitle: string;
  drawingCaption: string;
  scene: SceneType;
  Drawing: ComponentType;
  callout: {
    symbol: string;
    tolerance: string;
    diameter?: boolean;
    modifier?: string;
    datums?: string[];
  };
  sections: {
    definition: string[];
    application: string[];
    inspection: string[];
    notes: string[];
  };
  example: {
    title: string;
    problem: string;
    steps: ExampleStep[];
    result: string;
  };
  comparison: {
    columns: string[];
    rows: string[][];
  };
};

const commonComparison = {
  columns: ["Control", "Datum", "Zone", "Best Read"],
  rows: [
    ["Form", "No", "Free-floating", "Shape of one feature"],
    ["Orientation", "Yes", "Locked to datum", "Angle relationship"],
    ["Location", "Usually", "Locked to datum frame", "Where a feature belongs"],
  ],
};

type ReferencePageInput = {
  slug: string;
  name: string;
  symbol: string;
  category?: GdtCategory;
  summary: string;
  definition: string[];
  application: string[];
  inspection?: string[];
  notes?: string[];
  calloutTolerance?: string;
  modifier?: string;
};

function referencePage({
  slug,
  name,
  symbol,
  category = "Reference",
  summary,
  definition,
  application,
  inspection = [
    "Read the symbol with the attached dimension, note, or feature control frame before evaluating the feature.",
    "Verify the controlled feature using the drawing's stated limits, datum setup, and any special notes tied to the symbol.",
  ],
  notes = [
    "This page is part of the drawing-symbol reference set rather than a standalone geometric tolerance category.",
    "When the symbol modifies a feature control frame, read it together with the tolerance value and datum references.",
  ],
  calloutTolerance = "REF",
  modifier,
}: ReferencePageInput): GdtPage {
  return {
    slug,
    name,
    formalName: name,
    symbol,
    category,
    summary,
    relativeToDatum: category === "Dimension" ? "No" : "Context dependent",
    materialModifiers: "No",
    toleranceZone:
      category === "Dimension"
        ? "This symbol defines or modifies a size, shape, or manufacturing dimension rather than creating a GD&T tolerance zone by itself."
        : "This modifier changes how a related dimension, note, or feature control frame is interpreted.",
    drawingTitle: `${name} Drawing Use`,
    drawingCaption: `${name} is read with the adjacent dimension, note, or feature control frame so inspection uses the intended feature definition.`,
    scene: category === "Dimension" ? "circularity" : "datum",
    Drawing: category === "Dimension" ? CircularityDrawing : DatumDrawing,
    callout: { symbol, tolerance: calloutTolerance, modifier },
    sections: {
      definition,
      application,
      inspection,
      notes,
    },
    example: {
      title: `Worked Read: ${name}`,
      problem: `A drawing includes the ${name} symbol with a related feature requirement.`,
      steps: [
        { label: "Identify", value: symbol, note: `Recognize the ${name} symbol and the feature it modifies.` },
        { label: "Read", value: "Adjacent value", note: "Use the attached dimension, note, or frame cells as the controlling requirement." },
        { label: "Inspect", value: "Per drawing", note: "Measure the named feature using the specified interpretation rather than assuming a generic size check." },
      ],
      result: `${name} clarifies how the feature is defined so the drawing and inspection method stay aligned.`,
    },
    comparison: {
      columns: ["Item", "Controls", "Typical Placement"],
      rows: [
        [name, category === "Dimension" ? "Dimension interpretation" : "Requirement interpretation", "Next to a dimension, note, or frame"],
        ["GD&T control", "Geometric variation", "Feature control frame"],
        ["Datum reference", "Measurement setup", "Datum feature or frame cell"],
      ],
    },
  };
}

export const gdtPages: GdtPage[] = [
  {
    slug: "true-position",
    name: "True Position",
    formalName: "Position",
    symbol: "\u2316",
    category: "Location",
    summary:
      "Controls how far a feature of size may drift from its theoretically exact location, usually from a datum reference frame.",
    relativeToDatum: "Yes",
    materialModifiers: "MMC, LMC, or RFS",
    toleranceZone: "Most commonly a cylindrical zone centered on the true location of the feature axis.",
    drawingTitle: "Hole Pattern Located From Datums A, B, and C",
    drawingCaption:
      "The basic dimensions locate the true position. The feature control frame gives the permitted cylindrical zone for each hole axis.",
    scene: "position",
    Drawing: TruePositionDrawing,
    callout: { symbol: "\u2316", tolerance: "0.20", diameter: true, modifier: "M", datums: ["A", "B", "C"] },
    sections: {
      definition: [
        "Position defines the allowed variation between a feature's actual derived center, axis, or median plane and its theoretically exact location.",
        "The exact location is established with basic dimensions, then locked to a datum reference frame so the drawing describes function rather than a chain of plus/minus coordinates.",
      ],
      application: [
        "Use it for holes, pins, slots, tabs, bosses, and other features of size where assembly depends on location.",
        "With MMC, the callout can allow bonus tolerance as a clearance hole grows larger than its maximum material condition.",
      ],
      inspection: [
        "Measure the feature center in X and Y from the datum setup, then convert the radial offset into a diametric positional error.",
        "For a hole, also check along the depth so tilt of the axis is caught, not just the center at one surface.",
      ],
      notes: [
        "A diameter symbol gives a round or cylindrical tolerance zone. Without it, the zone behaves like a width between parallel lines or planes.",
        "Position can also control orientation because the feature axis must stay inside the zone through the part thickness.",
      ],
    },
    example: {
      title: "Worked Check: Off-Center Bolt Hole",
      problem:
        "A clearance hole is specified at true position with diameter 0.20 at MMC. Inspection finds the hole center is 0.06 mm off in X and 0.04 mm off in Y.",
      steps: [
        { label: "Radial offset", value: "sqrt(0.06^2 + 0.04^2) = 0.072 mm", note: "The center is 0.072 mm away from the exact basic location." },
        { label: "Diametric error", value: "2 x 0.072 = 0.144 mm", note: "Position is usually reported as a diametric error." },
        { label: "Compare", value: "0.144 <= 0.20", note: "The axis passes before any MMC bonus tolerance is needed." },
      ],
      result: "The hole location passes. If the actual hole is larger than MMC, the available position tolerance would increase.",
    },
    comparison: {
      columns: ["Control", "Best For", "Datum Required", "Zone Shape"],
      rows: [
        ["Position", "Locating holes, pins, slots, bosses", "Usually yes", "Cylindrical or planar"],
        ["Perpendicularity", "Keeping an axis square to a datum", "Yes", "Cylindrical or planar"],
        ["Profile", "Locating and shaping surfaces", "Often", "Boundary around a surface"],
      ],
    },
  },
  {
    slug: "flatness",
    name: "Flatness",
    formalName: "Flatness",
    symbol: "\u23e5",
    category: "Form",
    summary: "Controls surface waviness or bow by requiring all points of a surface to fit between two parallel planes.",
    relativeToDatum: "No",
    materialModifiers: "No",
    toleranceZone: "Two parallel planes separated by the flatness tolerance value.",
    drawingTitle: "Sealing Plate With Controlled Top Surface",
    drawingCaption:
      "Flatness controls only the top surface form. It does not force the surface to be parallel to the bottom face or to any datum.",
    scene: "flatness",
    Drawing: FlatnessDrawing,
    callout: { symbol: "\u23e5", tolerance: "0.08" },
    sections: {
      definition: [
        "Flatness is a form control. Every measured point on the controlled surface must fit inside a tolerance zone bounded by two parallel planes.",
        "It refines the shape of one surface without establishing a datum reference frame.",
      ],
      application: [
        "Use flatness on sealing faces, wear pads, fixture bases, and mating surfaces where rocking, leaks, or uneven contact are the concern.",
        "It is useful when the surface must be smooth and stable, but its orientation to another feature is not the functional requirement.",
      ],
      inspection: [
        "Collect points across the full length and width of the surface. A CMM or surface plate setup can evaluate the smallest pair of parallel planes enclosing those points.",
        "Do not clamp the part to a datum and call that flatness; once another surface is used for orientation, you are closer to checking parallelism.",
      ],
      notes: [
        "Flatness must normally be tighter than the associated size tolerance if it is applied to a feature of size.",
        "Flatness is the surface version of straightness: straightness uses two lines, while flatness uses two planes.",
      ],
    },
    example: {
      title: "Worked Check: Sealing Face",
      problem:
        "A pump cover has a top sealing face with flatness 0.08 mm. A scan of the surface shows the highest point is +0.031 mm and the lowest point is -0.026 mm.",
      steps: [
        { label: "Form spread", value: "0.031 - (-0.026) = 0.057 mm", note: "The surface variation is the distance between the two enclosing planes." },
        { label: "Compare", value: "0.057 <= 0.08", note: "The complete surface fits inside the allowed slab." },
        { label: "Functional read", value: "Pass", note: "The surface may still be tilted; flatness does not control orientation." },
      ],
      result: "The sealing face passes the flatness requirement. Add parallelism only if the face must also be oriented to another datum.",
    },
    comparison: {
      columns: ["Control", "Controls", "Uses Datum", "Common Mistake"],
      rows: [
        ["Flatness", "Surface form", "No", "Treating it like parallelism"],
        ["Straightness", "Line element form", "No", "Sampling only one direction"],
        ["Parallelism", "Orientation to a datum", "Yes", "Using it when only waviness matters"],
      ],
    },
  },
  {
    slug: "symmetry",
    name: "Symmetry",
    formalName: "Symmetry",
    symbol: "\u232f",
    category: "Location",
    summary: "Controls the median points of opposed surfaces so they remain centered about a datum center plane.",
    relativeToDatum: "Yes",
    materialModifiers: "No",
    toleranceZone: "Two parallel planes equally disposed about the datum center plane.",
    drawingTitle: "Centered Groove In A Rotating Coupling Block",
    drawingCaption:
      "The groove faces are sampled in opposing pairs. Their median points must stay inside the symmetry zone about datum plane A.",
    scene: "symmetry",
    Drawing: SymmetryDrawing,
    callout: { symbol: "\u232f", tolerance: "0.10", datums: ["A"] },
    sections: {
      definition: [
        "Symmetry is a 3D control for opposed features. It requires the midpoint between each pair of opposing surface points to lie near a datum center plane.",
        "It is not the casual meaning of symmetric appearance; it is a precise, point-by-point median-plane requirement.",
      ],
      application: [
        "Use symmetry only when balanced distribution about a center plane is truly functional, such as some rotating or load-balanced features.",
        "For most slots, grooves, and tabs, position or profile is easier to inspect and usually communicates the design intent more directly.",
      ],
      inspection: [
        "A CMM typically samples paired points on the two opposed surfaces, calculates each midpoint, and compares those midpoints to the datum center plane.",
        "Because the controlled median points are theoretical, quick hard-gaging is rarely practical.",
      ],
      notes: [
        "Symmetry is related to concentricity, but symmetry works about a plane while concentricity works about an axis.",
        "It does not accept MMC or LMC modifiers in typical ASME usage.",
      ],
    },
    example: {
      title: "Worked Check: Groove Centering",
      problem:
        "A coupling groove has symmetry 0.10 mm relative to datum plane A. Three measured median points are +0.018, -0.033, and +0.041 mm from the datum center plane.",
      steps: [
        { label: "Zone half-width", value: "0.10 / 2 = +/-0.05 mm", note: "The tolerance value is the full distance between the two symmetry planes." },
        { label: "Worst midpoint", value: "max(|0.018|, |0.033|, |0.041|) = 0.041 mm", note: "Every sampled midpoint must remain inside +/-0.05 mm." },
        { label: "Compare", value: "0.041 <= 0.05", note: "All measured median points are inside the zone." },
      ],
      result: "The groove passes symmetry. If the only need is assembly location, a position callout would usually be simpler to verify.",
    },
    comparison: {
      columns: ["Control", "Reference", "Measured Element", "Typical Use"],
      rows: [
        ["Symmetry", "Datum center plane", "Median points", "Balanced opposed surfaces"],
        ["Concentricity", "Datum axis", "Median points", "Balanced round features"],
        ["Position", "Datum frame", "Axis or median plane", "Practical feature location"],
      ],
    },
  },
  {
    slug: "datum",
    name: "Datum",
    formalName: "Datum Feature",
    symbol: "A",
    category: "Datum",
    summary: "Establishes the theoretically exact point, axis, line, or plane used as the anchor for measuring related GD&T controls.",
    relativeToDatum: "Reference item",
    materialModifiers: "MMB or LMB when applicable",
    toleranceZone: "A datum does not create a tolerance zone by itself; it creates the stable reference frame used by other zones.",
    drawingTitle: "Datum Feature A Establishing A Measurement Plane",
    drawingCaption: "The boxed datum letter identifies the physical feature used to simulate the datum during inspection.",
    scene: "datum",
    Drawing: DatumDrawing,
    callout: { symbol: "A", tolerance: "DATUM" },
    sections: {
      definition: [
        "A datum is theoretically exact. A datum feature is the real surface or feature of size on the part that is used to establish that datum.",
        "Think of datums as the measurement anchors for the part. They remove degrees of freedom so related features can be evaluated consistently.",
      ],
      application: [
        "Use datum features on functional faces, mounting surfaces, bores, slots, or tabs that control how the part fits or is inspected.",
        "The datum letter appears again in feature control frames to show which reference frame the tolerance zone is built from.",
      ],
      inspection: [
        "A datum plane may be simulated by a surface plate, fixture, CMM plane, or other inspection equipment.",
        "For a feature of size, the datum is usually the derived axis or center plane rather than the physical surface itself.",
      ],
      notes: [
        "Datum feature letters are shown in boxes and attached to the controlled feature with a triangle, leader, extension line, or related feature control frame.",
        "Form controls such as flatness, straightness, circularity, and cylindricity do not use datums because they control shape only.",
      ],
    },
    example: {
      title: "Worked Check: Choosing A Stable Datum",
      problem: "A bracket mounts to a machine base on one large face, then two holes locate a cover. The mounting face is labeled datum A.",
      steps: [
        { label: "Functional contact", value: "Large face = A", note: "The mounting face is the first surface that stabilizes the part in assembly." },
        { label: "Reference frame", value: "A then B/C", note: "A establishes orientation before hole locations are checked from secondary datums." },
        { label: "Inspection setup", value: "Simulate A", note: "The part is seated against a flat inspection surface or CMM plane before related checks." },
      ],
      result: "Datum A gives every downstream measurement a repeatable starting point, instead of measuring the holes from an arbitrary edge.",
    },
    comparison: {
      columns: ["Term", "Physical?", "Used For", "Example"],
      rows: [
        ["Datum", "No", "The exact reference", "A perfect plane or axis"],
        ["Datum feature", "Yes", "The real part feature", "Mounting face or bore"],
        ["Datum reference frame", "No", "Measurement coordinate system", "A|B|C in a callout"],
      ],
    },
  },
  {
    slug: "straightness",
    name: "Straightness",
    formalName: "Straightness",
    symbol: "\u23e4",
    category: "Form",
    summary: "Controls how much a surface line or derived median line may bend away from perfect straight form.",
    relativeToDatum: "No",
    materialModifiers: "Axis straightness can use MMC/LMC",
    toleranceZone: "Surface straightness uses two parallel lines; derived median line straightness uses a cylindrical boundary.",
    drawingTitle: "Surface Line Checked For Straight Form",
    drawingCaption: "Surface straightness is applied to a line element. Axis straightness is applied with the feature size dimension.",
    scene: "straightness",
    Drawing: StraightnessDrawing,
    callout: { symbol: "\u23e4", tolerance: "0.05" },
    sections: {
      definition: [
        "Straightness has two common readings. Surface straightness controls a line on a surface, while derived median line straightness controls the bend of a feature axis.",
        "The control is independent of datums because it refines form rather than location or orientation.",
      ],
      application: [
        "Use surface straightness on rails, slots, cylinders, and machined edges where a sampled line must remain uniform.",
        "Use axis straightness when a pin, shaft, or bore must remain within a straight envelope, often with MMC for functional gaging.",
      ],
      inspection: [
        "For a surface, sweep along the controlled line and compare the high-to-low variation to the straightness tolerance.",
        "For an axis, evaluate the derived median line from measured cross-sections or use a functional gage when MMC is specified.",
      ],
      notes: [
        "Straightness is the 2D cousin of flatness: it controls one line element instead of a full surface.",
        "Axis straightness can gain bonus tolerance as the feature departs from MMC.",
      ],
    },
    example: {
      title: "Worked Check: Guide Rail Line",
      problem: "A machined guide rail has straightness 0.05 mm along its top edge. The measured line ranges from +0.018 mm to -0.021 mm.",
      steps: [
        { label: "Variation", value: "0.018 - (-0.021) = 0.039 mm", note: "The line element must fit between two parallel lines 0.05 mm apart." },
        { label: "Compare", value: "0.039 <= 0.05", note: "The full sampled line is inside the zone." },
        { label: "Datum", value: "None", note: "No surface or axis is being used as a reference." },
      ],
      result: "The rail passes surface straightness. Orientation to another face would need a separate control.",
    },
    comparison: commonComparison,
  },
  {
    slug: "angularity",
    name: "Angularity",
    formalName: "Angularity",
    symbol: "\u2220",
    category: "Orientation",
    summary: "Controls a surface, line, or axis at a specified basic angle relative to a datum.",
    relativeToDatum: "Yes",
    materialModifiers: "Yes, uncommon for axes",
    toleranceZone: "Two parallel planes or a cylindrical zone oriented at the basic angle to the datum.",
    drawingTitle: "Bent Flange Held At A Basic Angle",
    drawingCaption: "The basic angle defines the ideal orientation. The GD&T tolerance controls the envelope around the angled surface.",
    scene: "orientation",
    Drawing: AngularityDrawing,
    callout: { symbol: "\u2220", tolerance: "0.20", datums: ["A"] },
    sections: {
      definition: [
        "Angularity controls orientation at any specified angle other than the special cases of 0 degrees and 90 degrees.",
        "The angle itself is basic; the tolerance value is a linear distance between boundary planes, not a plus/minus angular tolerance.",
      ],
      application: [
        "Use angularity for bent tabs, ramps, tapered faces, stamped features, and mating surfaces that must sit at a functional angle.",
        "It can control surface flatness and orientation in one requirement when the surface must mate cleanly at an angle.",
      ],
      inspection: [
        "The part is usually constrained to the datum and tilted with a sine bar or fixture so the angled feature can be swept like a flatness check.",
        "A CMM can evaluate the oriented tolerance zone directly from the datum reference frame and basic angle.",
      ],
      notes: [
        "Perpendicularity is angularity at 90 degrees, and parallelism is angularity at 0 degrees.",
        "Like other orientation controls, angularity requires a datum reference.",
      ],
    },
    example: {
      title: "Worked Check: 30 Degree Hook",
      problem: "A stamped hook face has angularity 0.20 mm to datum A at a basic 30 degree angle. A scan shows 0.14 mm total spread normal to the ideal plane.",
      steps: [
        { label: "Ideal plane", value: "30 degrees basic to A", note: "The datum and basic angle establish the center of the tolerance zone." },
        { label: "Surface spread", value: "0.14 mm", note: "Variation is checked as distance between parallel boundary planes." },
        { label: "Compare", value: "0.14 <= 0.20", note: "The full surface fits in the angularity zone." },
      ],
      result: "The hooked feature passes without tightening the entire thickness tolerance.",
    },
    comparison: {
      columns: ["Control", "Basic Angle", "Datum", "Best Use"],
      rows: [
        ["Angularity", "Any angle", "Yes", "Sloped or bent features"],
        ["Perpendicularity", "90 degrees", "Yes", "Square faces and axes"],
        ["Parallelism", "0/180 degrees", "Yes", "Constant spacing between faces"],
      ],
    },
  },
  {
    slug: "perpendicularity",
    name: "Perpendicularity",
    formalName: "Perpendicularity",
    symbol: "\u27c2",
    category: "Orientation",
    summary: "Controls a surface or axis so it remains square to a datum plane, line, or axis.",
    relativeToDatum: "Yes",
    materialModifiers: "Yes",
    toleranceZone: "Surface perpendicularity uses two parallel planes at 90 degrees; axis perpendicularity uses a cylindrical zone.",
    drawingTitle: "Hole Axis Kept Square To Datum A",
    drawingCaption: "The diameter symbol means the controlled hole axis must stay inside a cylindrical zone perpendicular to datum A.",
    scene: "orientation",
    Drawing: PerpendicularityDrawing,
    callout: { symbol: "\u27c2", tolerance: "0.10", diameter: true, modifier: "M", datums: ["A"] },
    sections: {
      definition: [
        "Perpendicularity is the 90 degree member of the orientation family. It can apply to a surface or to an axis.",
        "For surfaces, it controls an envelope of parallel planes. For holes and pins, it controls where the feature axis may lean.",
      ],
      application: [
        "Use it for square faces, mounting bosses, drilled holes, pins, and tabs that must assemble normal to a datum.",
        "Axis perpendicularity with MMC is common because it supports practical functional gaging for assembly clearance.",
      ],
      inspection: [
        "Surface perpendicularity is often checked against a square datum setup with a height gage or CMM.",
        "For holes and pins at MMC, a functional gage can confirm that size and perpendicularity together still permit assembly.",
      ],
      notes: [
        "Perpendicularity does not directly specify an angle tolerance in degrees; the tolerance is a distance.",
        "A diameter symbol in the feature control frame changes the zone from parallel planes to a cylinder.",
      ],
    },
    example: {
      title: "Worked Check: Mounting Hole",
      problem: "A hole has diameter 0.10 perpendicularity at MMC to datum A. The hole is 0.03 mm larger than MMC and the measured axis error is 0.11 mm.",
      steps: [
        { label: "Base tolerance", value: "0.10 mm", note: "This is the tolerance available at MMC." },
        { label: "Bonus", value: "0.03 mm", note: "Extra hole size adds bonus tolerance." },
        { label: "Available", value: "0.13 mm", note: "0.11 mm measured error is inside the available zone." },
      ],
      result: "The hole passes because the MMC bonus tolerance covers the measured perpendicularity error.",
    },
    comparison: commonComparison,
  },
  {
    slug: "profile-of-a-surface",
    name: "Profile Of A Surface",
    formalName: "Profile of a Surface",
    symbol: "\u2312",
    category: "Profile",
    summary: "Controls every point on a 3D surface within a boundary that follows the true surface profile.",
    relativeToDatum: "Optional",
    materialModifiers: "No",
    toleranceZone: "Two equally disposed surfaces following the exact contour of the nominal profile.",
    drawingTitle: "Curved Casting Surface Controlled By Profile",
    drawingCaption: "Profile wraps the tolerance zone around the intended 3D surface instead of checking only a line section.",
    scene: "profile",
    Drawing: ProfileSurfaceDrawing,
    callout: { symbol: "\u2312", tolerance: "0.30", datums: ["A", "B"] },
    sections: {
      definition: [
        "Profile of a surface controls a full 3D surface so every measured point stays within a tolerance zone that mimics the nominal shape.",
        "With datums, it can control form, orientation, location, and size relationships. Without datums, it behaves more like a form refinement.",
      ],
      application: [
        "Use it for castings, molded parts, fillets, aerodynamic surfaces, complex contours, and model-based surfaces.",
        "It is often the best choice when a surface is too complex for simple flatness, angularity, or position callouts.",
      ],
      inspection: [
        "CMM scanning, laser scanning, or point-cloud comparison is common because the whole surface must be evaluated against the nominal model.",
        "Simple radii or accessible contours may be checked with dedicated gages or traced measurements.",
      ],
      notes: [
        "Profile of a surface is the 3D version of profile of a line.",
        "A line profile may be used tighter than the surface profile to refine cross-section shape while keeping a broader whole-surface control.",
      ],
    },
    example: {
      title: "Worked Check: Molded Cover",
      problem: "A molded cover has surface profile 0.30 mm to datums A and B. Scan data shows the worst point is 0.12 mm outward and 0.09 mm inward from nominal.",
      steps: [
        { label: "Half-width", value: "0.30 / 2 = 0.15 mm", note: "A bilateral profile zone is commonly centered about the true profile." },
        { label: "Worst deviation", value: "max(0.12, 0.09) = 0.12 mm", note: "Both inward and outward deviations must remain inside the profile boundary." },
        { label: "Compare", value: "0.12 <= 0.15", note: "The scan stays inside the profile zone." },
      ],
      result: "The surface passes. Profile gives one clean requirement for the full contour instead of many local dimensions.",
    },
    comparison: {
      columns: ["Control", "Coverage", "Datum Use", "Typical Measurement"],
      rows: [
        ["Surface profile", "Entire 3D surface", "Optional", "CMM or scan"],
        ["Line profile", "One cross-section", "Optional", "Trace or CMM"],
        ["Flatness", "One planar surface", "No", "Surface plate or CMM"],
      ],
    },
  },
  {
    slug: "maximum-material-condition",
    name: "Maximum Material Condition",
    formalName: "MMC",
    symbol: "M",
    category: "Material",
    summary: "Describes the size condition where a feature contains the most material: smallest hole or largest pin.",
    relativeToDatum: "Modifier",
    materialModifiers: "This is the MMC modifier",
    toleranceZone: "MMC changes the effective boundary by combining feature size with geometric tolerance, often creating bonus tolerance.",
    drawingTitle: "Pin And Hole At Worst-Case Material",
    drawingCaption: "MMC supports functional gaging by checking whether the worst-case size and geometry still assemble.",
    scene: "material",
    Drawing: MmcDrawing,
    callout: { symbol: "\u2316", tolerance: "0.20", diameter: true, modifier: "M", datums: ["A", "B", "C"] },
    sections: {
      definition: [
        "Maximum Material Condition is the size of a feature when it contains the maximum amount of material within its size limits.",
        "For an internal feature such as a hole, MMC is the smallest allowed size. For an external feature such as a pin, MMC is the largest allowed size.",
      ],
      application: [
        "Use MMC when assembly clearance matters and a feature can be allowed more geometric error as it moves away from worst-case size.",
        "It is common with position and axis perpendicularity, and may apply to certain orientation or straightness axis controls.",
      ],
      inspection: [
        "Functional gages are common because they represent the virtual condition that the feature must not violate.",
        "Inspection compares actual size, geometric error, and any bonus tolerance gained by departing from MMC.",
      ],
      notes: [
        "Bonus tolerance equals the difference between the actual feature size and its MMC size.",
        "MMC is about features of size; it is not used on simple surfaces or profile tolerances.",
      ],
    },
    example: {
      title: "Worked Check: Clearance Hole Bonus",
      problem: "A hole has MMC size 10.00 mm and position diameter 0.20 at MMC. The actual hole is 10.08 mm and measured position error is 0.25 mm.",
      steps: [
        { label: "Bonus", value: "10.08 - 10.00 = 0.08 mm", note: "A larger hole has more clearance and earns bonus tolerance." },
        { label: "Available", value: "0.20 + 0.08 = 0.28 mm", note: "The geometric tolerance grows with the size departure." },
        { label: "Compare", value: "0.25 <= 0.28", note: "The measured position error is acceptable." },
      ],
      result: "The hole passes because its extra size provides enough bonus tolerance for the location error.",
    },
    comparison: {
      columns: ["Feature", "MMC", "LMC", "Why It Matters"],
      rows: [
        ["Hole", "Smallest size", "Largest size", "Least clearance"],
        ["Pin", "Largest size", "Smallest size", "Most interference risk"],
        ["Slot/tab", "Most material size", "Least material size", "Functional boundary"],
      ],
    },
  },
  {
    slug: "concentricity",
    name: "Concentricity",
    formalName: "Concentricity",
    symbol: "\u25ce",
    category: "Location",
    summary: "Controls derived median points of a cylindrical feature relative to a datum axis.",
    relativeToDatum: "Yes",
    materialModifiers: "No in ASME; ISO varies",
    toleranceZone: "A cylindrical zone around the datum axis containing all derived median points of the controlled feature.",
    drawingTitle: "Coaxial Shaft Sections Checked By Median Points",
    drawingCaption: "Concentricity evaluates calculated center points, which makes it much harder to inspect than runout or position.",
    scene: "concentricity",
    Drawing: ConcentricityDrawing,
    callout: { symbol: "\u25ce", tolerance: "0.05", datums: ["A"] },
    sections: {
      definition: [
        "Concentricity controls the derived median points of a round feature to a datum axis, not simply the visible surface or a best-fit axis.",
        "It was removed from ASME Y14.5-2018, but it still appears on drawings using earlier standards or ISO terminology such as coaxiality.",
      ],
      application: [
        "Use it only when balanced mass distribution around an axis is truly required.",
        "For most rotating parts, runout, total runout, or position communicates the function more clearly and is easier to inspect.",
      ],
      inspection: [
        "A CMM samples diametrically opposed points at multiple cross-sections, calculates their midpoints, and compares those points to the datum axis.",
        "Because the controlled points are derived, simple indicator readings do not directly prove concentricity.",
      ],
      notes: [
        "Concentricity is the circular counterpart to symmetry.",
        "Runout indirectly controls concentricity and circularity together by measuring the actual surface during rotation.",
      ],
    },
    example: {
      title: "Worked Check: Transmission Shaft",
      problem: "A shaft section has concentricity 0.05 mm to datum axis A. Measured derived median point offsets are 0.012, 0.018, and 0.021 mm.",
      steps: [
        { label: "Zone radius", value: "0.05 / 2 = 0.025 mm", note: "The cylindrical zone diameter is the stated tolerance." },
        { label: "Worst point", value: "0.021 mm", note: "Every derived median point must remain within the cylinder." },
        { label: "Compare", value: "0.021 <= 0.025", note: "The sampled median points are inside the zone." },
      ],
      result: "The feature passes concentricity, though a runout requirement would usually be simpler to verify on the shop floor.",
    },
    comparison: {
      columns: ["Control", "Measured Element", "Datum", "Practicality"],
      rows: [
        ["Concentricity", "Derived median points", "Axis", "Difficult"],
        ["Runout", "Actual rotating surface", "Axis", "Practical"],
        ["Position", "Feature axis", "Datum frame", "Common"],
      ],
    },
  },
  {
    slug: "runout",
    name: "Runout",
    formalName: "Circular Runout",
    symbol: "\u2197",
    category: "Runout",
    summary: "Controls how much a surface varies as the part rotates through 360 degrees around a datum axis.",
    relativeToDatum: "Yes",
    materialModifiers: "No",
    toleranceZone: "A circular tolerance zone at each cross-section, referenced to the datum axis during rotation.",
    drawingTitle: "Rotating Shaft Surface Checked With An Indicator",
    drawingCaption: "Runout captures wobble by holding the datum axis fixed and reading surface variation during rotation.",
    scene: "runout",
    Drawing: RunoutDrawing,
    callout: { symbol: "\u2197", tolerance: "0.03", datums: ["A"] },
    sections: {
      definition: [
        "Runout is the total indicator variation of a surface as the part rotates about a datum axis.",
        "It combines effects from axis offset and out-of-round surface form at each measured cross-section.",
      ],
      application: [
        "Use runout on shafts, gears, drills, axles, spindles, and other rotating features where wobble or vibration matters.",
        "It is a practical replacement for many concentricity requirements because it can be measured on the actual surface.",
      ],
      inspection: [
        "Constrain the datum axis in V-blocks, centers, or a spindle, then rotate the part while an indicator contacts the controlled surface.",
        "Circular runout is checked at individual cross-sections. Total runout sweeps along the length as the part rotates.",
      ],
      notes: [
        "Runout is always regardless of feature size; MMC and bonus tolerance are not used.",
        "Circular runout can be thought of as concentricity effects plus circularity effects at a section.",
      ],
    },
    example: {
      title: "Worked Check: Bearing Journal",
      problem: "A shaft journal has circular runout 0.03 mm to datum A. The indicator ranges from -0.006 mm to +0.018 mm during one rotation.",
      steps: [
        { label: "Indicator spread", value: "0.018 - (-0.006) = 0.024 mm", note: "Runout is total indicator movement during rotation." },
        { label: "Compare", value: "0.024 <= 0.03", note: "The surface variation is inside the allowed runout." },
        { label: "Section check", value: "Repeat", note: "Other cross-sections along the feature should be checked separately." },
      ],
      result: "The journal passes circular runout at the checked cross-section.",
    },
    comparison: {
      columns: ["Control", "Measured By", "Coverage", "Datum"],
      rows: [
        ["Circular runout", "Indicator per section", "2D cross-section", "Axis"],
        ["Total runout", "Indicator swept along length", "Full surface", "Axis"],
        ["Circularity", "Roundness per section", "2D cross-section", "No"],
      ],
    },
  },
  {
    slug: "parallelism",
    name: "Parallelism",
    formalName: "Parallelism",
    symbol: "\u2225",
    category: "Orientation",
    summary: "Controls a surface or axis so it remains parallel to a datum while staying inside a tolerance envelope.",
    relativeToDatum: "Yes",
    materialModifiers: "Yes for axes",
    toleranceZone: "Two parallel planes or a cylindrical axis zone oriented parallel to the datum.",
    drawingTitle: "Gear Face Held Parallel To Datum A",
    drawingCaption: "The datum face establishes orientation; the opposite face must remain inside the parallel tolerance zone.",
    scene: "orientation",
    Drawing: ParallelismDrawing,
    callout: { symbol: "\u2225", tolerance: "0.10", datums: ["A"] },
    sections: {
      definition: [
        "Parallelism controls the 0 or 180 degree orientation relationship between a feature and a datum.",
        "For a surface, the controlled points must fit between two planes parallel to the datum. For an axis, the zone may be cylindrical.",
      ],
      application: [
        "Use it for opposing faces, bearing seats, gear faces, slide ways, and any features that need consistent spacing in assembly.",
        "It is similar to flatness, but the zone is locked to a datum rather than floating with the surface.",
      ],
      inspection: [
        "Seat the datum feature against the inspection surface, then sweep the controlled surface with an indicator or height gage.",
        "The high-to-low indicator movement represents the parallelism error for the checked surface.",
      ],
      notes: [
        "Parallelism implies a form refinement for the controlled surface because the whole surface must fit between two parallel planes.",
        "Orientation controls require datums.",
      ],
    },
    example: {
      title: "Worked Check: Gear Face",
      problem: "A gear face has parallelism 0.10 mm to datum A. With A on the surface plate, the opposite face reads from 0.004 mm to 0.076 mm.",
      steps: [
        { label: "Indicator spread", value: "0.076 - 0.004 = 0.072 mm", note: "The spread is the distance between the two parallel boundary planes." },
        { label: "Compare", value: "0.072 <= 0.10", note: "The controlled face remains inside the zone." },
        { label: "Functional read", value: "Pass", note: "The face should maintain more even contact in assembly." },
      ],
      result: "The gear face passes parallelism relative to datum A.",
    },
    comparison: commonComparison,
  },
  {
    slug: "circularity",
    name: "Circularity",
    formalName: "Circularity",
    symbol: "\u25cb",
    category: "Form",
    summary: "Controls how close each circular cross-section of a round feature is to a true circle.",
    relativeToDatum: "No",
    materialModifiers: "No",
    toleranceZone: "Two concentric circles separated by the circularity tolerance in a cross-section plane.",
    drawingTitle: "Round Shaft Section Checked For Roundness",
    drawingCaption: "Circularity is evaluated one cross-section at a time and does not reference a datum axis.",
    scene: "circularity",
    Drawing: CircularityDrawing,
    callout: { symbol: "\u25cb", tolerance: "0.04" },
    sections: {
      definition: [
        "Circularity, also called roundness, controls the form of a circular cross-section so the surface is not too oval, lobed, or out of round.",
        "It is a form control, so it is independent of any datum reference.",
      ],
      application: [
        "Use it for shafts, holes, bearings, bushings, and other round features where shape matters beyond simple two-point diameter size.",
        "It can allow a looser size tolerance while still limiting out-of-round form error.",
      ],
      inspection: [
        "Rotate the feature and record surface variation in a single cross-section using roundness equipment or an indicator setup.",
        "Multiple cross-sections may be checked along the length when the whole feature must behave consistently.",
      ],
      notes: [
        "Circularity is the 2D version of cylindricity.",
        "A size tolerance already limits some form error through the envelope principle, but circularity can provide a clearer tighter limit.",
      ],
    },
    example: {
      title: "Worked Check: Shaft Roundness",
      problem: "A shaft cross-section has circularity 0.04 mm. The roundness trace fits between circles separated by 0.031 mm.",
      steps: [
        { label: "Trace spread", value: "0.031 mm", note: "This is the radial separation needed to enclose the cross-section." },
        { label: "Compare", value: "0.031 <= 0.04", note: "The section is inside the circularity zone." },
        { label: "Repeat sections", value: "As needed", note: "Circularity does not automatically evaluate the full cylinder length." },
      ],
      result: "The checked section passes circularity. Cylindricity or runout may be needed for full-length or datum-related control.",
    },
    comparison: {
      columns: ["Control", "Datum", "Zone", "Scope"],
      rows: [
        ["Circularity", "No", "Two concentric circles", "One section"],
        ["Cylindricity", "No", "Two coaxial cylinders", "Full cylinder"],
        ["Runout", "Yes", "Circular variation to axis", "Rotating section"],
      ],
    },
  },
  {
    slug: "total-runout",
    name: "Total Runout",
    formalName: "Total Runout",
    symbol: "\u2330",
    category: "Runout",
    summary: "Controls variation of an entire surface as the part rotates 360 degrees about a datum axis.",
    relativeToDatum: "Yes",
    materialModifiers: "No",
    toleranceZone: "A 3D zone around the full controlled surface while the datum axis is held fixed during rotation.",
    drawingTitle: "Full Shaft Surface Swept During Rotation",
    drawingCaption: "Total runout extends the runout check along the whole surface rather than checking one cross-section at a time.",
    scene: "runout",
    Drawing: RunoutDrawing,
    callout: { symbol: "\u2330", tolerance: "0.05", datums: ["A"] },
    sections: {
      definition: [
        "Total runout controls the complete surface variation of a rotating feature relative to a datum axis.",
        "It combines effects from circularity, cylindricity, straightness, taper, and coaxial relationship into one functional rotating-surface requirement.",
      ],
      application: [
        "Use it for shafts, bearing journals, gears, spindles, and other rotating surfaces where full-length wobble or taper would damage function.",
        "It is stricter than circular runout because the entire surface must remain acceptable as the indicator sweeps along the axis.",
      ],
      inspection: [
        "Constrain the datum axis in centers, V-blocks, or a spindle, rotate the part, and sweep an indicator along the controlled surface.",
        "The total indicator variation across the complete surface must stay within the stated tolerance.",
      ],
      notes: [
        "Total runout is always relative to a datum axis and does not use MMC or LMC bonus tolerance.",
        "Circular runout checks sections; total runout checks the whole controlled surface.",
      ],
    },
    example: {
      title: "Worked Check: Bearing Journal",
      problem: "A shaft journal has total runout 0.05 mm to datum A. The swept indicator ranges from -0.018 mm to +0.024 mm.",
      steps: [
        { label: "Indicator spread", value: "0.024 - (-0.018) = 0.042 mm", note: "Use the worst reading from the full sweep while the part rotates." },
        { label: "Compare", value: "0.042 <= 0.05", note: "The full surface stays inside the total runout limit." },
        { label: "Coverage", value: "Full length", note: "Unlike circular runout, this includes axial surface variation." },
      ],
      result: "The journal passes total runout relative to datum A.",
    },
    comparison: {
      columns: ["Control", "Coverage", "Datum", "Common Use"],
      rows: [
        ["Circular runout", "One cross-section", "Axis", "Local wobble"],
        ["Total runout", "Full surface", "Axis", "Full rotating surface"],
        ["Cylindricity", "Full cylinder", "No", "Form only"],
      ],
    },
  },
  {
    slug: "cylindricity",
    name: "Cylindricity",
    formalName: "Cylindricity",
    symbol: "\u232d",
    category: "Form",
    summary: "Controls how closely the full length of a cylindrical feature conforms to a perfect cylinder.",
    relativeToDatum: "No",
    materialModifiers: "No",
    toleranceZone: "Two coaxial cylinders separated by the cylindricity tolerance and covering the full feature length.",
    drawingTitle: "Cylinder Controlled For Roundness And Straightness",
    drawingCaption: "Cylindricity is the full-length form control for round features, independent of any datum.",
    scene: "circularity",
    Drawing: CircularityDrawing,
    callout: { symbol: "\u232d", tolerance: "0.04" },
    sections: {
      definition: [
        "Cylindricity is a 3D form control that requires every point on a cylindrical surface to fit between two coaxial cylinders.",
        "It controls both roundness at each cross-section and straightness along the axis without referencing a datum.",
      ],
      application: [
        "Use it for shafts, pins, bushings, bores, and sliding cylindrical features where the full surface form matters.",
        "It can control the shape more directly than tightening the entire size tolerance.",
      ],
      inspection: [
        "Measure multiple cross-sections along the full cylinder length with a CMM, roundness machine, or rotating indicator setup.",
        "The evaluated surface must fit inside the coaxial cylindrical tolerance band.",
      ],
      notes: [
        "Cylindricity is the 3D counterpart of circularity.",
        "Because it is a form control, it does not use datum references or material condition modifiers.",
      ],
    },
    example: {
      title: "Worked Check: Press-Fit Bore",
      problem: "A bore has cylindricity 0.04 mm. The evaluated full-length cylinder requires a 0.033 mm separation between enclosing cylinders.",
      steps: [
        { label: "Form spread", value: "0.033 mm", note: "This is the minimum coaxial cylinder separation enclosing the surface." },
        { label: "Compare", value: "0.033 <= 0.04", note: "The full bore surface fits inside the allowed zone." },
        { label: "Datum", value: "None", note: "The control checks form only, not alignment to another feature." },
      ],
      result: "The bore passes cylindricity.",
    },
    comparison: {
      columns: ["Control", "Datum", "Zone", "Scope"],
      rows: [
        ["Circularity", "No", "Two concentric circles", "One section"],
        ["Cylindricity", "No", "Two coaxial cylinders", "Full cylinder"],
        ["Total runout", "Yes", "Rotating surface zone", "Full related surface"],
      ],
    },
  },
  {
    slug: "feature-control-frame",
    name: "Feature Control Frame",
    formalName: "Feature Control Frame",
    symbol: "\u25ad",
    category: "Reference",
    summary: "The boxed GD&T sentence that names the control, tolerance, modifiers, and datum references for a feature.",
    relativeToDatum: "As required",
    materialModifiers: "As required",
    toleranceZone: "The frame defines the zone shape, size, modifiers, and datum reference frame used for inspection.",
    drawingTitle: "Reading A Feature Control Frame",
    drawingCaption: "The cells are read left to right: control symbol, tolerance zone, optional modifiers, and datum references.",
    scene: "datum",
    Drawing: TruePositionDrawing,
    callout: { symbol: "\u2316", tolerance: "0.20", diameter: true, modifier: "M", datums: ["A", "B", "C"] },
    sections: {
      definition: [
        "A feature control frame communicates how a geometric tolerance applies to a part feature.",
        "It identifies the GD&T symbol, tolerance value and zone shape, optional material or projection modifiers, and required datum references.",
      ],
      application: [
        "Use the frame anywhere a geometric control is needed on a drawing or model-based definition.",
        "Its datum order matters because primary, secondary, and tertiary references establish the inspection setup in sequence.",
      ],
      inspection: [
        "Read the frame from left to right, set up the referenced datums in order, then evaluate the controlled feature inside the specified tolerance zone.",
        "Modifiers such as MMC or LMC change how much tolerance may be available as feature size changes.",
      ],
      notes: [
        "Not every control needs a datum; form controls usually stand alone.",
        "The diameter symbol changes many location and orientation zones from planar width to cylindrical diameter.",
      ],
    },
    example: {
      title: "Worked Read: Position Callout",
      problem: "A frame shows position, diameter 0.20 at MMC, then datums A, B, and C.",
      steps: [
        { label: "Control", value: "Position", note: "The feature axis is being located." },
        { label: "Zone", value: "Diameter 0.20 at MMC", note: "The base zone is cylindrical and may gain bonus tolerance." },
        { label: "Datums", value: "A | B | C", note: "Inspection constrains A first, then B, then C." },
      ],
      result: "The frame describes a cylindrical position zone built from datum reference frame A-B-C.",
    },
    comparison: {
      columns: ["Frame Cell", "Meaning", "Example"],
      rows: [
        ["Symbol", "Geometric control", "Position"],
        ["Tolerance", "Zone size and shape", "Diameter 0.20"],
        ["Datums", "Reference frame", "A, B, C"],
      ],
    },
  },
  {
    slug: "profile-of-a-line",
    name: "Profile Of A Line",
    formalName: "Profile of a Line",
    symbol: "\u2312",
    category: "Profile",
    summary: "Controls a 2D cross-section of a line or curve within a tolerance band following the true profile.",
    relativeToDatum: "Optional",
    materialModifiers: "No",
    toleranceZone: "Two parallel curves following the nominal cross-section profile.",
    drawingTitle: "Curved Cross-Section Controlled By Line Profile",
    drawingCaption: "Line profile evaluates a slice through the part, not the complete 3D surface.",
    scene: "profile",
    Drawing: ProfileSurfaceDrawing,
    callout: { symbol: "\u2312", tolerance: "0.20", datums: ["A"] },
    sections: {
      definition: [
        "Profile of a line controls how far a single cross-section may vary from its true profile.",
        "The tolerance band follows the basic curve, radius, or contour named by the drawing or model.",
      ],
      application: [
        "Use it for airfoil sections, cams, curved faces, radii, and shaped contours where cross-section shape matters.",
        "It may be used with datums to control orientation and location, or without datums to refine form.",
      ],
      inspection: [
        "Inspect the specified section with a template, optical comparator, CMM trace, or scan against the nominal profile.",
        "Drawings can specify which sections are checked when infinitely many slices are possible.",
      ],
      notes: [
        "Profile of a surface controls the whole 3D surface; profile of a line controls one 2D section.",
        "Line profile is related to straightness and circularity because each controls a 2D trace.",
      ],
    },
    example: {
      title: "Worked Check: Wing Section",
      problem: "A section has line profile 0.20 mm. The largest outward deviation is 0.07 mm and inward deviation is 0.08 mm.",
      steps: [
        { label: "Half-width", value: "0.20 / 2 = 0.10 mm", note: "A bilateral profile zone is centered on the true profile unless otherwise specified." },
        { label: "Worst deviation", value: "max(0.07, 0.08) = 0.08 mm", note: "Both directions must remain inside the profile band." },
        { label: "Compare", value: "0.08 <= 0.10", note: "The checked section stays in tolerance." },
      ],
      result: "The cross-section passes line profile.",
    },
    comparison: {
      columns: ["Control", "Coverage", "Datum Use", "Zone"],
      rows: [
        ["Line profile", "2D section", "Optional", "Two offset curves"],
        ["Surface profile", "3D surface", "Optional", "Two offset surfaces"],
        ["Circularity", "Round section", "No", "Two circles"],
      ],
    },
  },
  {
    slug: "least-material-condition",
    name: "Least Material Condition",
    formalName: "LMC",
    symbol: "L",
    category: "Material",
    summary: "The size condition where a feature contains the least material: largest hole or smallest pin.",
    relativeToDatum: "Modifier",
    materialModifiers: "This is the LMC modifier",
    toleranceZone: "LMC can create bonus tolerance as the feature departs from least material size.",
    drawingTitle: "Pin And Hole At Least Material",
    drawingCaption: "LMC is useful when minimum wall thickness, edge distance, or guaranteed contact is the functional concern.",
    scene: "material",
    Drawing: MmcDrawing,
    callout: { symbol: "\u2316", tolerance: "0.15", diameter: true, modifier: "L", datums: ["A", "B"] },
    sections: {
      definition: [
        "Least Material Condition is the limit of size where a feature contains the least amount of material.",
        "For an internal feature such as a hole, LMC is the largest allowed size. For an external feature such as a pin, LMC is the smallest allowed size.",
      ],
      application: [
        "Use LMC when preserving wall thickness, edge distance, or minimum stock is more important than assembly clearance.",
        "It appears less often than MMC but is valuable for thin-wall holes and press-fit or contact-driven designs.",
      ],
      inspection: [
        "Compare actual feature size to the LMC limit, then add any departure from LMC as bonus tolerance where the callout permits it.",
        "No-go gaging concepts are often used when ensuring a feature is not too loose or too small.",
      ],
      notes: [
        "LMC applies to features of size, not arbitrary surfaces.",
        "MMC protects worst-case assembly clearance; LMC protects least-stock or minimum-contact conditions.",
      ],
    },
    example: {
      title: "Worked Check: Hole Near An Edge",
      problem: "A hole has LMC size 10.20 mm and position diameter 0.15 at LMC. The actual hole is 10.12 mm and position error is 0.20 mm.",
      steps: [
        { label: "Bonus", value: "10.20 - 10.12 = 0.08 mm", note: "A smaller hole has more material remaining near the edge." },
        { label: "Available", value: "0.15 + 0.08 = 0.23 mm", note: "The geometric tolerance grows by the departure from LMC." },
        { label: "Compare", value: "0.20 <= 0.23", note: "The measured error is within the available tolerance." },
      ],
      result: "The hole passes while maintaining the intended minimum material around it.",
    },
    comparison: {
      columns: ["Feature", "MMC", "LMC", "Typical Concern"],
      rows: [
        ["Hole", "Smallest", "Largest", "Wall thickness at LMC"],
        ["Pin", "Largest", "Smallest", "Guaranteed contact at LMC"],
        ["Slot/tab", "Most material", "Least material", "Boundary control"],
      ],
    },
  },
  {
    slug: "regardless-of-feature-size",
    name: "Regardless Of Feature Size",
    formalName: "RFS",
    symbol: "R",
    category: "Material",
    summary: "The default condition where geometric tolerance is independent of the actual feature size.",
    relativeToDatum: "Default",
    materialModifiers: "No bonus tolerance",
    toleranceZone: "The stated tolerance zone remains the same at every actual feature size.",
    drawingTitle: "Same Tolerance At Any Accepted Size",
    drawingCaption: "RFS is implied unless MMC or LMC is explicitly shown in the feature control frame.",
    scene: "material",
    Drawing: MmcDrawing,
    callout: { symbol: "\u27c2", tolerance: "0.10", diameter: true, datums: ["A"] },
    sections: {
      definition: [
        "Regardless of Feature Size means the geometric tolerance is applied independently of the measured size of the feature.",
        "It is the default condition under GD&T Rule #2 unless MMC or LMC is explicitly specified.",
      ],
      application: [
        "Use RFS when the feature size does not create meaningful extra functional clearance or stock for the controlled geometry.",
        "It is common when balance, centering, or precise relationship must be held consistently at all permitted sizes.",
      ],
      inspection: [
        "Measure the geometric error directly and compare it to the stated tolerance value.",
        "Do not add bonus tolerance from actual feature size when no material modifier is present.",
      ],
      notes: [
        "Many controls are always RFS because MMC and LMC are not applicable to them.",
        "Older drawings may show an S modifier, but modern ASME practice treats RFS as implied.",
      ],
    },
    example: {
      title: "Worked Check: Perpendicular Hole",
      problem: "A hole has perpendicularity diameter 0.10 to datum A with no material modifier. Its size is larger than nominal and axis error is 0.11 mm.",
      steps: [
        { label: "Modifier", value: "None", note: "RFS is implied by default." },
        { label: "Available", value: "0.10 mm", note: "Actual size does not add bonus tolerance." },
        { label: "Compare", value: "0.11 > 0.10", note: "The axis error exceeds the fixed zone." },
      ],
      result: "The hole fails the RFS perpendicularity requirement.",
    },
    comparison: {
      columns: ["Modifier", "Bonus?", "Best For"],
      rows: [
        ["RFS", "No", "Constant control"],
        ["MMC", "Yes, away from most material", "Assembly clearance"],
        ["LMC", "Yes, away from least material", "Minimum stock or contact"],
      ],
    },
  },
  {
    slug: "gdt-rule-1",
    name: "GD&T Rule #1",
    formalName: "Envelope Principle",
    symbol: "1",
    category: "Reference",
    summary: "The default ASME rule that limits feature form by the perfect-form envelope at maximum material condition.",
    relativeToDatum: "No",
    materialModifiers: "Built into size limits",
    toleranceZone: "The feature surface may not violate the perfect-form boundary at MMC while local sizes remain within limits.",
    drawingTitle: "Size Limits Controlling Form",
    drawingCaption: "At MMC the envelope requires perfect form; as size departs from MMC, more form variation can exist within the envelope.",
    scene: "material",
    Drawing: MmcDrawing,
    callout: { symbol: "1", tolerance: "ENVELOPE" },
    sections: {
      definition: [
        "Rule #1 says the form of a regular feature of size is controlled by its limits of size.",
        "At maximum material condition, the actual surface cannot extend beyond the perfect-form envelope.",
      ],
      application: [
        "Use it as the default interpretation for ASME drawings unless an exception or separate form control changes the requirement.",
        "It helps ensure holes, pins, tabs, and slots remain assembleable even when only size limits are shown.",
      ],
      inspection: [
        "Check local sizes against the dimensional limits, then verify the feature does not violate the MMC perfect-form boundary.",
        "Add flatness, straightness, circularity, or cylindricity when the default envelope does not control form tightly enough.",
      ],
      notes: [
        "Rule #1 is also called the envelope principle or Taylor principle.",
        "Exceptions include independency, free-state requirements, stock dimensions, average diameter, and explicit form controls on features of size.",
      ],
    },
    example: {
      title: "Worked Check: Pin Envelope",
      problem: "A pin has size limits 9.90 to 10.00 mm. At 10.00 mm MMC, its surface must fit a perfect 10.00 mm cylinder.",
      steps: [
        { label: "MMC", value: "10.00 mm", note: "Largest pin size contains the most material." },
        { label: "Envelope", value: "Perfect cylinder at 10.00", note: "No surface point may break this boundary." },
        { label: "Departure", value: "Smaller local size", note: "Form may vary only while the envelope is still respected." },
      ],
      result: "The pin must satisfy both local size limits and the perfect-form boundary.",
    },
    comparison: {
      columns: ["Concept", "ASME Default", "ISO Default"],
      rows: [
        ["Size controls form", "Yes via Rule #1", "Only with envelope requirement"],
        ["Independency", "Exception", "Default principle"],
        ["Refining form", "Add form controls", "Add form controls"],
      ],
    },
  },
  {
    slug: "unequally-disposed-profile",
    name: "Unequally Disposed Profile",
    formalName: "Unequally Disposed Profile",
    symbol: "\u24ca",
    category: "Profile",
    summary: "A profile modifier that shifts the profile tolerance zone unequally inside and outside the true profile.",
    relativeToDatum: "Follows profile callout",
    materialModifiers: "No",
    toleranceZone: "A profile zone where the total tolerance is distributed unequally about the true profile.",
    drawingTitle: "Profile Zone Offset Toward One Side",
    drawingCaption: "The value after the unequally disposed symbol tells how much of the total profile tolerance lies outside the material.",
    scene: "profile",
    Drawing: ProfileSurfaceDrawing,
    callout: { symbol: "\u2312", tolerance: "0.60", modifier: "U", datums: ["A", "B"] },
    sections: {
      definition: [
        "Unequally disposed profile is used with line or surface profile to place a profile tolerance zone unevenly about the true profile.",
        "The total tolerance still comes first; the value after the U symbol identifies how much lies outside the material.",
      ],
      application: [
        "Use it when function, cleanup stock, coating, or assembly clearance requires more profile tolerance on one side of the nominal surface.",
        "Castings and coated parts often benefit because excess material may be acceptable on one side but not the other.",
      ],
      inspection: [
        "Build the profile zone with the specified unequal distribution, then compare measured points to the shifted boundaries.",
        "A CMM or scan workflow should use the drawing's material-side direction to avoid reversing the offset.",
      ],
      notes: [
        "If the outside value equals the total tolerance, the zone is unilateral outside the material.",
        "If the outside value is zero, the zone is unilateral inside the material.",
      ],
    },
    example: {
      title: "Worked Check: Casting Stock",
      problem: "A surface has profile 0.60 U 0.50, meaning 0.50 mm is outside material and 0.10 mm is inside.",
      steps: [
        { label: "Outside", value: "0.50 mm", note: "Most of the tolerance allows cleanup stock." },
        { label: "Inside", value: "0.60 - 0.50 = 0.10 mm", note: "Only a small inward deviation is permitted." },
        { label: "Compare", value: "Use shifted band", note: "Measured points must stay inside this unequal profile zone." },
      ],
      result: "The callout favors extra outside material while tightly limiting inward deviation.",
    },
    comparison: {
      columns: ["Profile Zone", "Distribution", "Best Use"],
      rows: [
        ["Equal bilateral", "Centered", "Balanced variation"],
        ["Unequal", "Offset", "Stock or fit bias"],
        ["Unilateral", "All one side", "One-sided functional limit"],
      ],
    },
  },
  {
    slug: "independency",
    name: "Independency",
    formalName: "Independency",
    symbol: "\u24be",
    category: "Reference",
    summary: "An ASME modifier that separates size control from form control for the associated feature.",
    relativeToDatum: "No",
    materialModifiers: "Overrides envelope behavior",
    toleranceZone: "Size limits and form limits are evaluated separately instead of through the Rule #1 envelope.",
    drawingTitle: "Size And Form Controlled Separately",
    drawingCaption: "The independency symbol removes the default simultaneous size-and-form control for that feature.",
    scene: "material",
    Drawing: FlatnessDrawing,
    callout: { symbol: "\u24be", tolerance: "INDEPENDENT" },
    sections: {
      definition: [
        "Independency indicates that the requirement for perfect form at MMC is removed for the associated size dimension.",
        "Size and form are then controlled separately, usually with another form control if form still matters.",
      ],
      application: [
        "Use it only when the default Rule #1 envelope is not intended for a feature of size.",
        "It is an ASME concept; ISO uses independency as the default unless envelope requirement is added.",
      ],
      inspection: [
        "Check size against the stated limits, then inspect any separate form control independently.",
        "Without a separate form control, the feature form may be much less constrained than under Rule #1.",
      ],
      notes: [
        "Independency can increase manufacturing freedom but must be used carefully around assembly features.",
        "It is often paired with a refining flatness, straightness, circularity, or cylindricity requirement.",
      ],
    },
    example: {
      title: "Worked Read: Plate Thickness",
      problem: "A plate thickness has an independency symbol and the lower face has a separate flatness callout.",
      steps: [
        { label: "Size", value: "Check thickness limits", note: "Thickness is accepted by local size only." },
        { label: "Envelope", value: "Removed", note: "Perfect form at MMC is not imposed by Rule #1." },
        { label: "Form", value: "Check flatness", note: "The separate flatness callout controls the named surface." },
      ],
      result: "The drawing separates thickness acceptance from the surface flatness requirement.",
    },
    comparison: {
      columns: ["Concept", "Effect", "Standard Context"],
      rows: [
        ["Rule #1", "Size controls form", "ASME default"],
        ["Independency", "Size separate from form", "ASME exception"],
        ["Envelope requirement", "Size controls form", "ISO addition"],
      ],
    },
  },
  {
    slug: "envelope_requirement",
    name: "Envelope Requirement",
    formalName: "Envelope Requirement",
    symbol: "\u24ba",
    category: "Reference",
    summary: "An ISO symbol that makes size control form through the perfect-form envelope at MMC.",
    relativeToDatum: "No",
    materialModifiers: "Envelope at MMC",
    toleranceZone: "The feature must remain within the perfect-form envelope at maximum material condition.",
    drawingTitle: "ISO Envelope Requirement Applied To Size",
    drawingCaption: "ISO drawings use the circled E when size is intended to control form like ASME Rule #1.",
    scene: "material",
    Drawing: MmcDrawing,
    callout: { symbol: "\u24ba", tolerance: "ENVELOPE" },
    sections: {
      definition: [
        "Envelope requirement is an ISO drawing symbol that states size controls form at the perfect-form boundary of MMC.",
        "It produces an effect similar to ASME Rule #1, which is not the ISO default.",
      ],
      application: [
        "Use it on ISO drawings when a feature of size must not violate the maximum-material perfect-form envelope.",
        "It can be applied to an individual dimension or through a general note when the whole drawing needs the principle.",
      ],
      inspection: [
        "Check local sizes and verify the feature surface remains inside the MMC perfect-form envelope.",
        "Use separate form controls when a tighter or more specific form limit is needed.",
      ],
      notes: [
        "ASME generally assumes the envelope principle by default for regular features of size.",
        "ISO generally treats size and form independently unless the envelope requirement is shown.",
      ],
    },
    example: {
      title: "Worked Read: ISO Pin",
      problem: "An ISO pin dimension includes the circled E symbol with size limits 9.90 to 10.00 mm.",
      steps: [
        { label: "MMC", value: "10.00 mm", note: "Largest pin contains the most material." },
        { label: "Envelope", value: "Perfect cylinder at 10.00", note: "The surface must not violate this boundary." },
        { label: "Local size", value: "Within limits", note: "Every local size must still remain between 9.90 and 10.00 mm." },
      ],
      result: "The ISO callout applies envelope behavior to the pin.",
    },
    comparison: {
      columns: ["Symbol", "Meaning", "Where Common"],
      rows: [
        ["E", "Envelope requirement", "ISO drawings"],
        ["Rule #1", "Envelope by default", "ASME drawings"],
        ["I", "Independency", "ASME exception"],
      ],
    },
  },
  {
    slug: "datum-target",
    name: "Datum Target",
    formalName: "Datum Target",
    symbol: "\u25c9",
    category: "Datum",
    summary: "Identifies a specific point, line, or area used to establish a datum from controlled contact locations.",
    relativeToDatum: "Defines datum",
    materialModifiers: "No",
    toleranceZone: "Datum targets do not create tolerance zones; they define where datum simulation contacts the part.",
    drawingTitle: "Target Points Establishing Datum A",
    drawingCaption: "Datum targets are numbered contact locations used when a full surface is not suitable as the datum simulator.",
    scene: "datum",
    Drawing: DatumDrawing,
    callout: { symbol: "\u25c9", tolerance: "A1 A2 A3" },
    sections: {
      definition: [
        "A datum target defines a specific point, line, or area used to establish a datum on a part.",
        "The target symbol is divided horizontally, with the datum letter and target number shown in the lower half.",
      ],
      application: [
        "Use datum targets for castings, forgings, molded parts, or irregular surfaces where full-surface contact would be unstable or unrealistic.",
        "Targets can represent points, lines, or defined areas depending on how the datum simulator should touch the part.",
      ],
      inspection: [
        "Fixture or simulate the part using the specified target contacts, then inspect related features from the datum established by those targets.",
        "Solid and dashed target leader lines can distinguish near-side and far-side target locations on drawings.",
      ],
      notes: [
        "Point targets are often shown with an X-shaped mark at a dimensioned location.",
        "Area targets include size or shape information in the upper half of the target symbol.",
      ],
    },
    example: {
      title: "Worked Setup: Casting Datum",
      problem: "A rough casting uses three datum targets A1, A2, and A3 to establish datum plane A.",
      steps: [
        { label: "Contact", value: "A1, A2, A3", note: "Three target locations stabilize the primary datum plane." },
        { label: "Simulate", value: "Fixture pads", note: "The part rests on controlled pads rather than an uneven full surface." },
        { label: "Inspect", value: "From datum A", note: "Related tolerances are evaluated after the target datum is established." },
      ],
      result: "The target scheme creates a repeatable datum from controlled contact points.",
    },
    comparison: {
      columns: ["Target Type", "Drawing Cue", "Simulator"],
      rows: [
        ["Point", "X mark", "Spherical or point contact"],
        ["Line", "Located phantom line", "Edge or cylindrical pin"],
        ["Area", "Size in upper half", "Pad or shaped contact"],
      ],
    },
  },
  referencePage({
    slug: "continuous-feature",
    name: "Continuous Feature",
    symbol: "CF",
    summary: "Indicates separated surfaces or feature segments are to be treated as one continuous feature.",
    definition: [
      "The continuous feature symbol tells the reader to apply Rule #1 and related geometric controls across disjointed feature segments as though the interruption were not present.",
      "ASME Y14.5-2018 expanded its use so surfaces as well as features of size can be treated continuously when the drawing makes that intent clear.",
    ],
    application: [
      "Use it for interrupted bosses, split cylindrical lands, or separated coplanar pads that must behave as one feature.",
      "Do not use an identical-feature count when the real intent is one combined feature; use continuous feature instead.",
    ],
  }),
  referencePage({
    slug: "projected-tolerance-zone",
    name: "Projected Tolerance Zone",
    symbol: "P",
    summary: "Extends a tolerance zone beyond the feature surface to protect fastener clearance in assembly.",
    definition: [
      "The projected tolerance zone symbol evaluates the controlled axis beyond the physical depth of the feature.",
      "It is most common on threaded holes or pins where orientation error can cause interference in a mating part.",
    ],
    application: [
      "Use it when a fastener must pass through a mating part whose thickness magnifies hole-axis tilt.",
      "The projected height may be shown in the feature control frame or as a dimensioned projected zone on the drawing.",
    ],
    calloutTolerance: "0.20",
    modifier: "P",
  }),
  referencePage({
    slug: "free-state-symbol",
    name: "Free State Symbol",
    symbol: "F",
    summary: "Marks a dimension or tolerance that must be evaluated while a non-rigid part is unrestrained.",
    definition: [
      "The free state symbol means the associated requirement is checked without external forces except gravity.",
      "It is useful on flexible sheet metal, rubber, plastic, and other parts that can change shape when restrained.",
    ],
    application: [
      "Use it to exempt a specific feature from a drawing-wide restrained condition note.",
      "Place it after the tolerance value in the feature control frame or with the applicable dimension.",
    ],
    modifier: "F",
  }),
  referencePage({
    slug: "restrained-condition",
    name: "Restrained Condition Note",
    symbol: "RC",
    summary: "A drawing note that requires inspection while the part is fixtured, fastened, or otherwise restrained.",
    definition: [
      "A restrained condition note overrides the normal free-state inspection assumption for non-rigid parts.",
      "The note should define the fixture, fasteners, forces, or assembly condition used to hold the part during inspection.",
    ],
    application: [
      "Use it when a flexible part only has its functional shape after installation or clamping.",
      "Pair it with free-state symbols for any features that still need to be inspected without restraint.",
    ],
    calloutTolerance: "NOTE",
  }),
  referencePage({
    slug: "tangent-plane",
    name: "Tangent Plane",
    symbol: "T",
    summary: "Applies a surface control to a simulated tangent plane made from the high points of a surface.",
    definition: [
      "The tangent plane modifier evaluates the theoretical tangent plane contacted by the high points of an irregular surface.",
      "The surface elements themselves are not all controlled by the zone; only the simulated tangent plane must satisfy the orientation requirement.",
    ],
    application: [
      "Use it with related surface controls such as parallelism, perpendicularity, or angularity.",
      "Add a separate form control when flatness of the actual surface elements is also important.",
    ],
    modifier: "T",
  }),
  referencePage({
    slug: "counterbore",
    name: "Counterbore",
    symbol: "⌴",
    category: "Dimension",
    summary: "Defines a flat-bottomed cylindrical recess coaxial with a smaller hole.",
    definition: [
      "A counterbore is a larger, flat-bottomed cylindrical hole aligned with another cylindrical hole.",
      "It provides a recessed flat mounting surface, commonly for socket head cap screws.",
    ],
    application: [
      "List the counterbore symbol with the counterbore diameter and depth below the smaller hole size.",
      "Use it when the fastener head must sit below or within the part surface.",
    ],
    calloutTolerance: "DIA x DEPTH",
  }),
  referencePage({
    slug: "spotface",
    name: "Spotface",
    symbol: "SF",
    category: "Dimension",
    summary: "Defines a shallow flat-bottomed cylindrical cleanup area around a hole.",
    definition: [
      "A spotface is a shallow flat-bottomed cylindrical feature coaxial with a hole.",
      "It creates a flat seating surface without necessarily recessing the fastener head like a counterbore.",
    ],
    application: [
      "Use it for washer seats, pan head screws, or cleanup pads on rough cast or forged surfaces.",
      "The spotface callout includes the symbol, the spotface diameter, and depth only when a depth is required.",
    ],
    calloutTolerance: "DIA",
  }),
  referencePage({
    slug: "countersink",
    name: "Countersink",
    symbol: "⌵",
    category: "Dimension",
    summary: "Defines a conical recess used so a flathead fastener can sit flush or below the surface.",
    definition: [
      "A countersink is a conical hole coaxial with a cylindrical hole.",
      "Its angle is selected to match the fastener head, commonly 82 degrees for many inch fasteners and 90 degrees for many metric fasteners.",
    ],
    application: [
      "Use it on through holes where the fastener head must be flush or slightly recessed.",
      "Call out the countersink diameter and included angle with the countersink symbol.",
    ],
    calloutTolerance: "DIA x ANGLE",
  }),
  referencePage({
    slug: "diameter",
    name: "Diameter",
    symbol: "⌀",
    category: "Dimension",
    summary: "Indicates a circular feature is dimensioned by its full diameter.",
    definition: [
      "The diameter symbol identifies that the size value is the full width through the center of a circular feature.",
      "It is used for full circular features and circular arcs greater than 180 degrees.",
    ],
    application: [
      "Place the diameter symbol before the size value for holes, pins, bosses, and other circular features.",
      "Use radius instead when the circular feature is less than a 180 degree arc.",
    ],
    calloutTolerance: "10.00",
  }),
  referencePage({
    slug: "square",
    name: "Square",
    symbol: "□",
    category: "Dimension",
    summary: "Indicates a square feature so one size dimension controls both equal sides.",
    definition: [
      "The square symbol states that the dimension applies to a square feature with equal side lengths.",
      "It avoids repeating the same size requirement on both sides of the feature.",
    ],
    application: [
      "Place the square symbol before the size dimension of the square feature.",
      "Use it when the feature's two perpendicular sides share the same size and tolerance.",
    ],
    calloutTolerance: "0.500",
  }),
  referencePage({
    slug: "radius",
    name: "Radius",
    symbol: "R",
    category: "Dimension",
    summary: "Indicates a circular feature is dimensioned by radius, or half of its diameter.",
    definition: [
      "The radius symbol identifies that the dimension value is the distance from the center of curvature to the surface.",
      "A regular radius controls size but does not require the contour to be a smooth fair curve.",
    ],
    application: [
      "Place R before the size value when dimensioning arcs, fillets, rounds, or partial circular features.",
      "Use controlled radius when the surface must remain continuous and without reversals.",
    ],
    calloutTolerance: "2.00",
  }),
  referencePage({
    slug: "controlled-radius",
    name: "Controlled Radius",
    symbol: "CR",
    category: "Dimension",
    summary: "Defines a radius that must also be a smooth, fair curve without reversals.",
    definition: [
      "Controlled radius is a radius requirement with an added contour quality requirement.",
      "The surface must stay within the radial tolerance zone and remain continuous without reversals.",
    ],
    application: [
      "Use CR when a rough but in-zone radius is not functionally acceptable.",
      "It is common where smooth load transfer, sealing, or fatigue behavior depends on a fair radius.",
    ],
    calloutTolerance: "2.00",
  }),
  referencePage({
    slug: "spherical-radius",
    name: "Spherical Radius",
    symbol: "SR",
    category: "Dimension",
    summary: "Indicates the radius value applies to a spherical feature.",
    definition: [
      "Spherical radius is the radius version used for spherical rather than planar circular features.",
      "The symbol is shown as SR before the size dimension.",
    ],
    application: [
      "Use SR for ball ends, domes, spherical pockets, and other sphere-derived surfaces.",
      "Use spherical diameter when the spherical feature is defined by full diameter instead.",
    ],
    calloutTolerance: "1.25",
  }),
  referencePage({
    slug: "spherical-diameter",
    name: "Spherical Diameter",
    symbol: "S⌀",
    category: "Dimension",
    summary: "Indicates the diameter value applies to a spherical feature.",
    definition: [
      "Spherical diameter modifies the diameter symbol to show the feature is spherical, not merely circular.",
      "The symbol is shown before the size dimension.",
    ],
    application: [
      "Use it for balls, spherical seats, domes, or other features controlled by a full sphere diameter.",
      "Use spherical radius when the design intent is better expressed from the center to the surface.",
    ],
    calloutTolerance: "3.00",
  }),
  referencePage({
    slug: "depth",
    name: "Depth Symbol",
    symbol: "↧",
    category: "Dimension",
    summary: "Indicates the depth of a hole, slot, counterbore, or similar feature.",
    definition: [
      "The depth symbol identifies a measurement from the outer surface of a part to the bottom limit of a feature.",
      "For drilled holes, depth is typically measured to the deepest location where full diameter is achieved, not to the drill point tip.",
    ],
    application: [
      "Use it with blind holes, slots, counterbores, and similar recesses.",
      "Clarify whether the depth is full-diameter depth when the feature bottom includes a cone or tool point.",
    ],
    calloutTolerance: "12.0",
  }),
  referencePage({
    slug: "dimension-origin",
    name: "Dimension Origin",
    symbol: "OR",
    category: "Dimension",
    summary: "Identifies the required origin surface or location from which a dimension must be measured.",
    definition: [
      "The dimension origin symbol replaces a normal arrowhead at the origin end of a dimension.",
      "It fixes the measurement direction so the dimension must be taken from the specified origin surface.",
    ],
    application: [
      "Use it when measuring from the wrong side would change the functional interpretation.",
      "Treat the marked surface as the origin for that dimension, similar to a local measurement reference.",
    ],
    calloutTolerance: "ORIGIN",
  }),
  referencePage({
    slug: "parting-line",
    name: "Parting Line",
    symbol: "PL",
    category: "Dimension",
    summary: "Marks where mold or die segments meet on a cast, molded, or forged part.",
    definition: [
      "A parting line is the separation between mold or die segments.",
      "It may be visible on cast, molded, or forged parts unless removed by later processing.",
    ],
    application: [
      "Use a phantom line and parting-line symbol to define the intended location on a drawing.",
      "If the parting line is not dimensioned, its location may be left to the manufacturer.",
    ],
    calloutTolerance: "LINE",
  }),
  referencePage({
    slug: "arc-length",
    name: "Arc Length",
    symbol: "⌒",
    category: "Dimension",
    summary: "Indicates a dimension value is measured along a curved outline rather than as a chord.",
    definition: [
      "The arc length symbol is placed over a value to show the dimension follows the length of an arc.",
      "By default in ASME usage, the arc length applies to the surface nearest the dimension unless otherwise specified.",
    ],
    application: [
      "Use it for bent pipe, curved profiles, and partial circular outlines where path length matters.",
      "Specify centerline arc length when the dimension is intended along the centerline rather than the nearest surface.",
    ],
    calloutTolerance: "6.000",
  }),
  referencePage({
    slug: "conical-taper",
    name: "Conical Taper",
    symbol: "⌲",
    category: "Dimension",
    summary: "Defines a taper as the ratio of diameter change to length change.",
    definition: [
      "The conical taper symbol indicates the listed value is a standard taper ratio.",
      "The value represents diameter change over length change.",
    ],
    application: [
      "Use it for cones, tapered shafts, tapered bores, and standard taper series.",
      "The symbol is shown with the vertical leg on the left regardless of the taper direction on the drawing.",
    ],
    calloutTolerance: "1:10",
  }),
  referencePage({
    slug: "slope-modifying-symbol",
    name: "Slope",
    symbol: "⌳",
    category: "Dimension",
    summary: "Defines a flat taper as the ratio of height change to length change.",
    definition: [
      "The slope modifying symbol indicates the value is controlled as slope rather than an angle dimension.",
      "The value represents height change over length change.",
    ],
    application: [
      "Use it for wedges, ramps, drafted flats, and flat tapered surfaces.",
      "The vertical leg of the symbol is shown on the left regardless of the direction of the slope.",
    ],
    calloutTolerance: "1:20",
  }),
  referencePage({
    slug: "multiple-identical-features",
    name: "Multiple Identical Features",
    symbol: "8X",
    summary: "Uses a count plus X to apply one dimension or requirement to repeated identical features.",
    definition: [
      "The #X designator prevents redundant dimensions when the same requirement applies to multiple identical features.",
      "The number before X is the quantity of repeated features covered by the dimension or callout.",
    ],
    application: [
      "Use it for repeated holes, chamfers, radii, surfaces, or pattern features.",
      "Use continuous feature instead when separated surfaces are intended to be controlled as one combined feature.",
    ],
    calloutTolerance: "COUNT",
  }),
];

export const gdtCategories: Array<"All" | GdtCategory> = [
  "All",
  "Datum",
  "Dimension",
  "Form",
  "Orientation",
  "Location",
  "Profile",
  "Runout",
  "Material",
  "Reference",
];

export function getGdtPage(slug: string) {
  return gdtPages.find((page) => page.slug === slug);
}
