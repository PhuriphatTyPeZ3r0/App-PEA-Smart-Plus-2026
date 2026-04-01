"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

/** s-terms — ข้อตกลงและเงื่อนไขการใช้บริการ (ส่วนแรก)
 *  ปุ่ม "เลื่อนไปด้านล่าง" → /terms/accept
 */
export default function TermsPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
    setIsAtBottom(isBottom);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.back} onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span style={styles.title}>ข้อตกลงและเงื่อนไขการใช้บริการ</span>
        <div style={styles.flag}>
          <div style={{ flex: 2, background: "#A51931" }} />
          <div style={{ flex: 1, background: "#F4F5F8" }} />
          <div style={{ flex: 3, background: "#2D2A4A" }} />
          <div style={{ flex: 1, background: "#F4F5F8" }} />
          <div style={{ flex: 2, background: "#A51931" }} />
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} style={styles.content} onScroll={handleScroll}>
        <p style={styles.date}>อัปเดตล่าสุด เมื่อ 15 กรกฎาคม 2568</p>

        <p style={styles.bold}>โปรดอ่านข้อตกลงการใช้งานเว็บไซต์นี้อย่างระมัดระวัง</p>
        <p style={styles.para}>
          เนื่องจากข้อตกลงต่อไปนี้มีผลผูกพันทางกฎหมายระหว่างท่านและการไฟฟ้าส่วนภูมิภาค
          และใช้บังคับกับการใช้งานเว็บไซต์นี้และการเข้าใช้งานเว็บไซต์นี้
        </p>
        <p style={styles.para}>
          การยอมรับข้อตกลงการใช้งานเว็บไซต์และการใช้งานเว็บไซต์นี้ท่านรับทราบว่าท่านได้อ่านและเข้าใจข้อตกลงการใช้งานเว็บไซต์นี้
        </p>
        <p style={styles.bold}>
          โปรดอย่าใช้งานเว็บไซต์นี้หากท่านไม่ตกลงที่จะผูกพันตามข้อตกลงการใช้งาน
        </p>
        <p style={styles.para}>
          ข้อตกลงระหว่างท่านและบริษัท เว็บไซต์ของบริษัทอาจประกอบด้วยเว็บไซต์หรือเพจต่างๆ
          ที่ดำเนินการโดยบริษัท ซึ่งมีสำนักงานใหญ่ตั้งอยู่ที่เลขที่ 200 ถนนงามวงศ์วาน
          แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900
        </p>
        <p style={styles.para}>
          การใช้งานเว็บไซต์ของบริษัทอยู่ภายใต้เงื่อนไขว่าท่านจะยอมรับโดยไม่มีการเปลี่ยนแปลงข้อตกลงนี้
        </p>
        <p style={styles.para}>
          โดยไม่แก้ไขประการใดทั้งสิ้น ท่านแสดงว่าท่านยอมรับข้อตกลงของบริษัทนี้ทุกประการ
          หากท่านไม่ยอมรับข้อตกลงนี้ โปรดอย่าใช้งานเว็บไซต์นี้
        </p>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        {!isAtBottom ? (
          <button
            style={styles.btn}
            onClick={() => {
              contentRef.current?.scrollTo({
                top: contentRef.current.scrollHeight,
                behavior: "smooth",
              });
            }}
          >
            เลื่อนไปด้านล่าง
          </button>
        ) : (
          <>
            <button style={styles.btn} onClick={() => router.push("/register")}>
              ยอมรับ
            </button>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <span
                style={styles.btnReject}
                onClick={() => router.push("/onboarding/1")}
              >
                ไม่ยอมรับ
              </span>
            </div>
          </>
        )}
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
    padding: "16px 20px 100px",
    fontSize: 14,
    color: "#333",
    lineHeight: 1.75,
  } as React.CSSProperties,
  date: { fontSize: 12, color: "#888", marginBottom: 12 } as React.CSSProperties,
  bold: { fontWeight: 700, marginBottom: 8 } as React.CSSProperties,
  para: { marginBottom: 10 } as React.CSSProperties,
  footer: {
    position: "sticky",
    bottom: 0,
    padding: "14px 20px 24px",
    background: "#fff",
    boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
  } as React.CSSProperties,
  btn: {
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
