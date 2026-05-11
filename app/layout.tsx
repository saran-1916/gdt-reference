import type { Metadata } from "next";
import { AppHeader } from "@/components/gdt/app-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "GD&T Reference",
  description:
    "Interactive GD&T reference pages with drawings, examples, and 3D tolerance zone visualizations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
