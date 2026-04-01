"use client";

import OnboardingLayout from "../OnboardingLayout";

/** s-ob4 — ยิ่งใช้ ยิ่งได้ กับ Watt-D Point (หน้าสุดท้ายของ onboarding) */
export default function Onboarding4Page() {
  return (
    <OnboardingLayout
      activeDot={3}
      title="ยิ่งใช้ ยิ่งได้ กับ Watt-D Point"
      description={"ทุกการชำระค่าไฟและการใช้บริการ\nเปลี่ยนเป็นคะแนนสะสม\nแลกรับส่วนลดและสิทธิพิเศษจากร้านค้าชั้นนำมากมาย"}
      illustration={<Illustration4 />}
      nextRoute="/terms"
      nextLabel="เริ่มใช้งาน"
      /* ไม่มีปุ่ม ข้าม — หน้าสุดท้ายใช้ปุ่มเดียว */
    />
  );
}

function Illustration4() {
  return (
    <div style={{ width: 260, height: 260, position: "relative" }}>
      <div style={{
        position: "absolute", inset: 20, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(244,160,208,.2),transparent 70%)",
      }} />

      {/* stars left */}
      <div style={{ position: "absolute", left: 20, top: 70, fontSize: 32 }}>⭐</div>
      <div style={{ position: "absolute", left: 30, top: 110, fontSize: 22 }}>⭐</div>

      {/* gift top right */}
      <div style={{ position: "absolute", right: 20, top: 30, fontSize: 52 }}>🎁</div>

      {/* coupon bottom right */}
      <div style={{
        position: "absolute", right: 18, bottom: 50,
        width: 80, height: 38,
        background: "linear-gradient(135deg,#F090C8,#C860A0)",
        borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#fff", fontSize: 18, fontWeight: 900 }}>%</span>
        <div style={{ position: "absolute", left: -6, width: 12, height: 12, borderRadius: "50%", background: "#fff" }} />
        <div style={{ position: "absolute", right: -6, width: 12, height: 12, borderRadius: "50%", background: "#fff" }} />
        <div style={{
          position: "absolute", left: 10, right: 10, top: "50%", height: 1,
          borderTop: "2px dashed rgba(255,255,255,.5)",
        }} />
      </div>

      {/* Watt-D coin center */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-55%)",
        width: 90, height: 90, borderRadius: "50%",
        background: "linear-gradient(135deg,#F8D040,#C89020)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 24px rgba(200,144,0,.45)",
      }}>
        <div style={{
          width: 74, height: 74, borderRadius: "50%",
          background: "linear-gradient(135deg,#C430A0,#8B1A6B)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 32 }}>⚡</span>
        </div>
      </div>
    </div>
  );
}
