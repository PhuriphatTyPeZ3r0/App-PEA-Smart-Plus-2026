"use client";

import OnboardingLayout from "../OnboardingLayout";

/** s-ob3 — บริการด้านระบบไฟฟ้าครบ จบในแอปเดียว */
export default function Onboarding3Page() {
  return (
    <OnboardingLayout
      activeDot={2}
      title={"บริการด้านระบบไฟฟ้าครบ\nจบในแอปเดียว"}
      description={"ขอติดตั้งมิเตอร์ใหม่ ขยายเขตไฟฟ้า\nหรือขอใช้ไฟชั่วคราว ยื่นเรื่องง่าย\nติดตามสถานะคำร้องได้ทุกขั้นตอน"}
      illustration={<Illustration3 />}
      nextRoute="/onboarding/4"
      nextLabel="ถัดไป"
      skipRoute="/terms"
    />
  );
}

function Illustration3() {
  return (
    <div style={{ width: 260, height: 260, position: "relative" }}>
      <div style={{
        position: "absolute", inset: 20, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(244,160,208,.2),transparent 70%)",
      }} />

      {/* bulb left */}
      <div style={{ position: "absolute", left: 14, top: 90, fontSize: 44 }}>💡</div>

      {/* pole right (faint) */}
      <div style={{ position: "absolute", right: 20, bottom: 30, width: 50, height: 100, opacity: .25 }}>
        <div style={{ width: 6, height: 100, background: "#E090C8", margin: "0 auto", borderRadius: 3 }} />
        <div style={{ position: "absolute", top: 8, left: 0, width: 50, height: 4, background: "#E090C8", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 18, left: 8, width: 34, height: 3, background: "#E090C8", borderRadius: 2 }} />
      </div>

      {/* circuit lines center */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-40%,-55%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 4,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: "50%",
                background: "#F8C820", boxShadow: "0 0 8px #F8C820",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 36, height: 4, background: "#F8C820", borderRadius: 2 }} />
            ))}
          </div>
          <div style={{ fontSize: 42 }}>⚡</div>
        </div>
      </div>

      {/* building bottom right (faint) */}
      <div style={{ position: "absolute", right: 14, bottom: 20, opacity: .3 }}>
        <div style={{
          width: 56, height: 56, background: "#E890C8",
          borderRadius: "8px 8px 0 0",
          display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4,
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3, width: 40 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ height: 8, background: "rgba(255,255,255,.6)", borderRadius: 1 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
