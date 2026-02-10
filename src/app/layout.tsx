// app/layout.tsx (or src/app/layout.tsx)
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sanjeevan Portfolio",
  description: "Full-stack engineer portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* ensure Tailwind utilities for background/text are applied */}
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
