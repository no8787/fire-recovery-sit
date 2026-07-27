import { ImageResponse } from "next/og";
import { COMPANY } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0f172a",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 28,
            fontWeight: 700,
            color: "#fb923c",
            letterSpacing: 2,
          }}
        >
          FIRE RECOVERY
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, marginTop: 20 }}>
          화재 발생부터 완전한 복구까지
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#cbd5e1", marginTop: 24 }}>
          {COMPANY.nameKo} ({COMPANY.nameEn})
        </div>
      </div>
    ),
    { ...size }
  );
}
