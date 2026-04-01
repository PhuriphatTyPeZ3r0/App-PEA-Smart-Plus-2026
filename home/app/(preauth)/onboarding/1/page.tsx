"use client";

import OnboardingLayout from "../OnboardingLayout";

/** s-ob1 — จ่ายค่าไฟง่าย แค่ปลายนิ้ว */
export default function Onboarding1Page() {
  return (
    <OnboardingLayout
      activeDot={0}
      title="จ่ายค่าไฟง่าย แค่ปลายนิ้ว"
      description={"ชำระค่าไฟฟ้าได้ทันทีผ่านแอปฯ\nรองรับ QR Code และบัตรเครดิต\nไม่ต้องเดินทาง ไม่ต้องกลัวเกินกำหนด"}
      illustration={<Illustration1 />}
      nextRoute="/onboarding/2"
      nextLabel="ถัดไป"
      skipRoute="/terms"
    />
  );
}

function Illustration1() {
  return (
    <div style={{ width: 260, height: 260, position: "relative" }}>
      {/* bg glow */}
      <div style={{
        position: "absolute", inset: 20, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(244,160,208,.2) 0%,rgba(244,160,208,.05) 70%,transparent 100%)",
      }} />

      {/* receipt — top right */}
      <div style={{
        position: "absolute", right: 30, top: 40,
        width: 90, height: 120, background: "#fff",
        borderRadius: 10, boxShadow: "0 4px 20px rgba(139,26,107,.15)",
        transform: "rotate(8deg)", overflow: "hidden",
      }}>
        <div style={{ height: 12, background: "#F0D0E8", marginBottom: 6 }} />
        <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: 5 }}>
          {[100, 70, 100, 60, 100].map((w, i) => (
            <div key={i} style={{ height: 5, background: "#F5E0F0", borderRadius: 2, width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* card — top left */}
      <div style={{
        position: "absolute", left: 18, top: 30,
        width: 90, height: 58,
        background: "linear-gradient(135deg,#F0A0D8,#E070B8)",
        borderRadius: 10, transform: "rotate(-15deg)",
        boxShadow: "0 4px 16px rgba(196,48,122,.3)",
      }}>
        <div style={{ height: 12, background: "rgba(255,255,255,.2)", borderRadius: "10px 10px 0 0" }} />
        <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ height: 4, background: "rgba(255,255,255,.5)", borderRadius: 2, width: "60%" }} />
          <div style={{ height: 4, background: "rgba(255,255,255,.35)", borderRadius: 2, width: "40%" }} />
        </div>
      </div>

      {/* gold coins */}
      {[
        { left: 24, bottom: 60, size: 28 },
        { left: 50, bottom: 46, size: 22 },
        { left: 34, bottom: 78, size: 18 },
      ].map(({ left, bottom, size }, i) => (
        <div key={i} style={{
          position: "absolute", left, bottom,
          width: size, height: size, borderRadius: "50%",
          background: "radial-gradient(circle,#F8D860,#C89020)",
          boxShadow: "0 2px 6px rgba(180,130,20,.4)",
        }} />
      ))}

      {/* center ฿ icon */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: 80, height: 100,
        background: "linear-gradient(135deg,#C430A0,#8B1A6B)",
        borderRadius: "10px 10px 14px 14px",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 24px rgba(139,26,107,.4)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1 }}>฿</div>
          <div style={{ width: 30, height: 3, background: "rgba(255,255,255,.5)", borderRadius: 2, margin: "4px auto 0" }} />
        </div>
        {/* lightning badge */}
        <div style={{
          position: "absolute", bottom: -14, right: -10,
          width: 30, height: 30, borderRadius: "50%",
          background: "#F8C820",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, boxShadow: "0 3px 10px rgba(200,144,0,.5)",
        }}>⚡</div>
      </div>
    </div>
  );
}
