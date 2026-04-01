"use client";

import { useRouter } from "next/navigation";

/** s-terms2 — ข้อตกลงและเงื่อนไข (ส่วนที่ 2)
 *  ยอมรับ → /register
 *  ไม่ยอมรับ → back
 */
export default function TermsAcceptPage() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.back} onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span style={styles.title}>ข้อตกลงและเงื่อนไข</span>
        <div style={styles.flag}>
          <div style={{ flex: 2, background: "#A51931" }} />
          <div style={{ flex: 1, background: "#F4F5F8" }} />
          <div style={{ flex: 3, background: "#2D2A4A" }} />
          <div style={{ flex: 1, background: "#F4F5F8" }} />
          <div style={{ flex: 2, background: "#A51931" }} />
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <p style={styles.para}>
          โปรดศึกษานโยบายการรักษาความปลอดภัยของบริษัทเพิ่มเติม
          การเชื่อมต่อกับเว็บไซต์อื่นๆ บริษัทอาจเชื่อมต่อเว็บไซต์นี้กับเว็บไซต์อื่นๆ
          ของบริษัทเพื่อให้ข้อมูลและอำนวยความสะดวกแก่ท่านเท่านั้น
        </p>
        <p style={styles.para}>
          การที่ท่านเข้าสู่เว็บไซต์เหล่านั้นย่อมอยู่ในความเสี่ยงของท่านเอง
          และท่านยอมรับว่าบริษัทไม่รับผิดชอบต่อเนื้อหา ความถูกต้องและความน่าเชื่อถือ
        </p>
        <p style={styles.para}>
          ปราศจากการรับรองหรือรับประกัน ไม่ว่าโดยชัดแจ้งหรือโดยปริยาย
          บริษัทไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดขึ้น ไม่ว่าจะเป็น สินค้า หรือบริการใดๆ
        </p>
        <p style={styles.para}>
          บริษัทไม่มีข้อตกลงหรือสัญญาใดๆ กับบุคคลหรือเว็บไซต์อื่นดังกล่าวข้างต้น
          ทั้งนี้บริษัทขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อตกลงการใช้งานเว็บไซต์นี้ไปยังเว็บไซต์อื่นดังกล่าวนั้น
        </p>
      </div>

      {/* Buttons */}
      <div style={styles.footer}>
        <button style={styles.btnAccept} onClick={() => router.push("/register")}>
          ยอมรับ
        </button>
        <div style={{ textAlign: "center" }}>
          <span style={styles.btnReject} onClick={() => router.back()}>
            ไม่ยอมรับ
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
  } as React.CSSProperties,
  header: {
    padding: "8px 16px 0",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  } as React.CSSProperties,
  back: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  } as React.CSSProperties,
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111",
    flex: 1,
  } as React.CSSProperties,
  flag: {
    width: 32,
    height: 22,
    borderRadius: 3,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  } as React.CSSProperties,
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px",
    fontSize: 14,
    color: "#333",
    lineHeight: 1.75,
  } as React.CSSProperties,
  para: { marginBottom: 10 } as React.CSSProperties,
  footer: {
    padding: "14px 20px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    flexShrink: 0,
  } as React.CSSProperties,
  btnAccept: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #C4307A, #8B1A6B)",
    color: "#fff",
    fontSize: 17,
    fontWeight: 700,
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
  } as React.CSSProperties,
  btnReject: {
    color: "#8B1A6B",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
};
