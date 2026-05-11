import { NextResponse } from "next/server";
import { calculateFit, type UnitSystem } from "@/lib/iso286";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nominalSize = Number(searchParams.get("size") ?? "50");
  const holeClass = searchParams.get("hole") ?? "H7";
  const shaftClass = searchParams.get("shaft") ?? "g6";
  const unit = (searchParams.get("unit") ?? "mm") as UnitSystem;

  try {
    const calculation = calculateFit({
      nominalSize,
      holeClass,
      shaftClass,
      unit,
    });

    return NextResponse.json({
      ok: true,
      calculation,
      sourceNotes: [
        "Standard tolerance unit and IT grade factors follow ISO 286 calculation conventions.",
        "Fundamental deviation support is implemented for common engineering hole and shaft letters used by the UI.",
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to calculate ISO 286 fit.",
      },
      { status: 400 },
    );
  }
}
