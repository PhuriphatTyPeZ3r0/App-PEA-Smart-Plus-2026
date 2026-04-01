"use client";

import OnboardingLayout from "../OnboardingLayout";

/** s-ob2 — รู้ทันทุกการใช้ไฟ ดูประวัติย้อนหลัง */
export default function Onboarding2Page() {
  return (
    <OnboardingLayout
      activeDot={1}
      title="รู้ทันทุกการใช้ไฟ ดูประวัติย้อนหลัง"
      description={"ดูประวัติการใช้ไฟฟ้าย้อนหลัง\nและเปรียบเทียบหน่วยการใช้งาน"}
      illustration={<Illustration2 />}
      nextRoute="/onboarding/3"
      nextLabel="ถัดไป"
      skipRoute="/terms"
    />
  );
}

function Illustration2() {
  return (
    <div style={{ width: 260, height: 260, position: "relative" }}>
      <div style={{
        position: "absolute", inset: 20, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(244,160,208,.2),transparent 70%)",
      }} />

      {/* lightning left */}
      <div style={{ position: "absolute", left: 18, top: 80, fontSize: 48, opacity: .9 }}>⚡</div>

      {/* chart card center */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-55%)",
        width: 88, height: 88,
        background: "linear-gradient(135deg,#C430A0,#8B1A6B)",
        borderRadius: 18,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 24px rgba(139,26,107,.4)",
      }}>
        <div style={{ fontSize: 40 }}>📊</div>
        <div style={{
          position: "absolute", bottom: -10, right: -10,
          width: 32, height: 32, borderRadius: "50%",
          background: "#F8C820",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 3px 8px rgba(200,144,0,.4)",
        }}>🔍</div>
      </div>

      {/* chat bubbles right */}
      <div style={{
        position: "absolute", right: 10, top: 50,
        width: 100, height: 28,
        background: "linear-gradient(135deg,#F0C0E8,#E890D0)",
        borderRadius: "8px 8px 8px 2px",
      }} />
      <div style={{
        position: "absolute", right: 10, top: 86,
        width: 80, height: 28,
        background: "linear-gradient(135deg,#F0C0E8,#E890D0)",
        borderRadius: "8px 8px 8px 2px", opacity: .7,
      }} />

      {/* dot bottom */}
      <div style={{
        position: "absolute", bottom: 54, left: "50%",
        transform: "translateX(-50%)",
        width: 14, height: 14, borderRadius: "50%",
        background: "#F090C8",
      }} />
    </div>
  );
}
