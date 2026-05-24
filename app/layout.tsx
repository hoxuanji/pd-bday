import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SUBJECT } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: `PAPIYA — PD-OS v${SUBJECT.age}.0`,
  description: "An interactive personality dashboard. Birthday edition.",
  robots: "noindex, nofollow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Lottie web component — no npm needed */}
        <script
          src="https://unpkg.com/@lottiefiles/lottie-player@2/dist/lottie-player.js"
          async
        />
      </head>
      <body className="bg-bg-base text-ink-primary antialiased scanline-effect">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
