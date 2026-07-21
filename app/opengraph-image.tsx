import { ImageResponse } from "next/og";
import { SUBJECT } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `PAPIYA — PD-OS v${SUBJECT.age}.0`;

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", background: "#070706",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: 80, fontFamily: "monospace",
        }}
      >
        <div style={{ color: "#6a6a60", fontSize: 28, letterSpacing: 6 }}>
          {`PD-OS v${SUBJECT.age}.0 · BIRTHDAY EDITION`}
        </div>
        <div style={{ color: "#c8f135", fontSize: 200, fontWeight: 700, lineHeight: 1 }}>
          PAPIYA
        </div>
        <div style={{ color: "#f2f2ef", fontSize: 34, letterSpacing: 2 }}>
          HAPPY BIRTHDAY · 22 MAY · AN INTERACTIVE DOSSIER
        </div>
      </div>
    ),
    size
  );
}
