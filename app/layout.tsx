import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SUBJECT } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pd-bday.vercel.app"), // ponytail: swap for real Vercel URL at deploy
  title: `PAPIYA — PD-OS v${SUBJECT.age}.0`,
  description: "A birthday dossier. Chaos, drama, loyalty — fully documented.",
  robots: "noindex, nofollow",
  openGraph: {
    title: `PAPIYA — PD-OS v${SUBJECT.age}.0`,
    description: "A birthday dossier. Chaos, drama, loyalty — fully documented.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `PAPIYA — PD-OS v${SUBJECT.age}.0`,
    description: "A birthday dossier. Chaos, drama, loyalty — fully documented.",
  },
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
      </head>
      <body className="bg-bg-base text-ink-primary antialiased scanline-effect">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
