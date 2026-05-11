import type { Metadata } from "next";
import { FitCalculatorApp } from "@/components/fit/fit-calculator-app";

export const metadata: Metadata = {
  title: "ISO 286 Limits & Fits Calculator | GD&T Reference",
  description:
    "Engineering-grade ISO 286 hole and shaft tolerance calculator with fit classification, tolerance charts, formula trace, recommendations, CSV export, and shareable calculations.",
  keywords: [
    "ISO 286 calculator",
    "limits and fits calculator",
    "tolerance calculator",
    "shaft and hole tolerance",
    "engineering tolerance chart",
    "hole basis system",
    "shaft basis system",
  ],
  openGraph: {
    title: "ISO 286 Limits & Fits Calculator",
    description:
      "Calculate ISO 286 deviations, limits, clearance, interference, IT grades, and fit classification in a professional engineering interface.",
    type: "website",
  },
};

export default function FitToolPage() {
  return <FitCalculatorApp />;
}
