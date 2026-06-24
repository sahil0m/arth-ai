import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ARTH.AI — Causal Agentic Intelligence for Banking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #070b14 0%, #0f1626 60%, #161f33 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #7c5cff, #5b6bff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            A
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#fff" }}>ARTH.AI</div>
          <div
            style={{
              marginLeft: 12,
              fontSize: 18,
              color: "#7c5cff",
              border: "1px solid rgba(124,92,255,0.4)",
              borderRadius: 999,
              padding: "6px 16px",
            }}
          >
            SBI BI Hackathon · GFF 2026
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
            The first bank that
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, color: "#7c5cff" }}>
            understands WHY.
          </div>
          <div style={{ marginTop: 24, fontSize: 28, color: "#94a3b8", maxWidth: 900 }}>
            Causal, agentic AI for customer acquisition, digital adoption &amp; engagement.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["Causal Inference Engine", "4 Autonomous Agents", "RBI FREE-AI · DPDP by design"].map(
            (t) => (
              <div
                key={t}
                style={{
                  fontSize: 20,
                  color: "#2dd4bf",
                  border: "1px solid rgba(45,212,191,0.3)",
                  borderRadius: 12,
                  padding: "10px 18px",
                  display: "flex",
                }}
              >
                {t}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
