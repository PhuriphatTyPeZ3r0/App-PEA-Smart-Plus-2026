"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function TermsPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 60;
    setIsAtBottom(atBottom);
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
          และใช้บังคับกับการใช้งานเว็บไซต์นี้และข้อมูลที่ระบุไว้ในเว็บไซต์นี้
        </p>
        <p style={styles.para}>
          การยอมรับข้อตกลงการใช้งานเว็บไซต์และการใช้งานเว็บไซต์นี้ ท่านรับทราบว่าท่านได้อ่านและเข้าใจข้อตกลงการใช้งานเว็บไซต์
          และท่านตกลงที่จะผูกพันและปฏิบัติตามข้อตกลงการใช้งานเว็บไซต์นี้
        </p>
        <p style={styles.bold}>
          โปรดอย่าใช้งานเว็บไซต์นี้หากท่านไม่ตกลงที่จะผูกพันตามข้อตกลงการใช้งานนี้
        </p>

        <p style={styles.sectionTitle}>ข้อตกลงระหว่างท่านและบริษัท</p>
        <p style={styles.para}>
          เว็บไซต์ของบริษัทอาจประกอบด้วยเว็บไซต์หรือเว็บเพจต่างๆ ที่ดำเนินการโดยบริษัท
          ซึ่งมีสำนักงานใหญ่ตั้งอยู่ เลขที่ 200 ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กทม. 10900
          (เว็บไซต์และเว็บเพจทั้งหมดนี้จะรวมเรียกว่า {'"เว็บไซต์ของบริษัท"'})
          การใช้งานเว็บไซต์ของบริษัทอยู่ภายใต้เงื่อนไขว่าท่านจะต้องตกลงและยอมรับข้อตกลงการใช้งานเว็บไซต์นี้
          โดยไม่แก้ไขประการใดทั้งสิ้น การที่ท่านใช้งานเว็บไซต์ของบริษัทย่อมก่อให้เกิดความผูกพันทางกฎหมาย
          ตามข้อกำหนดที่ระบุไว้ในข้อตกลงการใช้งานเว็บไซต์
          หากท่านไม่ยอมรับข้อตกลงการใช้งานเว็บไซต์นี้ โปรดอย่าเข้าสู่และใช้งานเว็บไซต์ของบริษัท
        </p>

        <p style={styles.sectionTitle}>การแก้ไขเปลี่ยนแปลงข้อตกลงการใช้งานเว็บไซต์นี้</p>
        <p style={styles.para}>
          บริษัทขอสงวนสิทธิที่จะแก้ไขหรือเปลี่ยนแปลงข้อตกลงการใช้งานที่ระบุไว้ในเว็บไซต์นี้
          ท่านมีหน้าที่ตรวจสอบข้อตกลงการใช้งานเว็บไซต์นี้ รวมถึงข้อกำหนดเพิ่มเติมใดๆ
          ที่ระบุไว้ในเว็บไซต์ของบริษัทอย่างสม่ำเสมอ
          การที่ท่านใช้งานเว็บไซต์ของบริษัทอย่างต่อเนื่องย่อมถือว่าท่านรับทราบและตกลงตามข้อตกลงการใช้งาน
          ที่ได้แก้ไขหรือเปลี่ยนแปลงนั้นแล้ว
        </p>

        <p style={styles.sectionTitle}>การใช้และการเปิดเผยข้อมูลส่วนบุคคล</p>
        <p style={styles.para}>
          เว้นแต่กฎหมายที่ใช้บังคับจะกำหนดเป็นอย่างอื่น ท่านตกลงและยอมรับว่าข้อมูลส่วนบุคคลของท่านทั้งหมด
          ที่บริษัทเก็บรวบรวมจากเว็บไซต์ของบริษัทอาจถูกใช้เพื่อประกอบการทำธุรกรรมและ/หรือการใช้บริการของท่าน
          รวมถึงเพื่อวัตถุประสงค์ในการวิเคราะห์ข้อมูล เสนอ ให้ ใช้ และ/หรือปรับปรุงผลิตภัณฑ์หรือบริการต่างๆ
          ของบริษัท และ/หรือเพื่อตรวจสอบรายการธุรกรรม รวมทั้งอาจถูกเปิดเผยให้แก่บริษัทในกลุ่มธุรกิจทางการเงิน
          ผู้สอบบัญชี ผู้ตรวจสอบภายนอก สถาบันการเงิน หน่วยงานราชการ ผู้รับโอนสิทธิเรียกร้อง
          และ/หรือนิติบุคคลหรือบุคคลใดๆ ที่บริษัทได้รับความยินยอมจากท่านให้เปิดเผยข้อมูลดังกล่าว
        </p>

        <p style={styles.sectionTitle}>การเชื่อมต่อกับเว็บไซต์อื่นๆ</p>
        <p style={styles.para}>
          โปรดศึกษานโยบายการรักษาความปลอดภัยของบริษัทเพิ่มเติม
          บริษัทอาจเชื่อมต่อเว็บไซต์นี้กับเว็บไซต์อื่นๆ ที่ไม่ได้อยู่ภายใต้การควบคุมดูแลของบริษัท
          เพื่อให้ข้อมูลและอำนวยความสะดวกแก่ท่านเท่านั้น
          การที่ท่านเข้าสู่เว็บไซต์เหล่านั้นย่อมเป็นความเสี่ยงของท่านและบริษัทจะไม่รับผิดชอบต่อความเสียหายใดๆ
          ที่เกิดขึ้นจากการกระทำของท่านที่เกี่ยวข้องกับข้อมูล สินค้า หรือบริการที่แสดงหรือเสนอบนเว็บไซต์
          ของบุคคลภายนอกใดๆ ที่เชื่อมต่อกับเว็บไซต์ของบริษัท ไม่ว่าในกรณีใดๆ ทั้งสิ้น
          ทั้งนี้ บริษัทไม่ให้คำรับประกัน คำรับรองหรือคำแนะนำใดๆ ที่เกี่ยวข้องกับข้อมูล
          สินค้าหรือบริการใดๆ ที่ปรากฏอยู่บนเว็บไซต์ของบุคคลภายนอกดังกล่าว
          และบริษัทจะไม่รับผิดชอบต่อความบกพร่องหรือการผิดสัญญาใดๆ ที่เกี่ยวข้องกับสินค้า
          หรือบริการใดๆ ที่ปรากฏหรือโฆษณาบนเว็บไซต์เหล่านั้น
          บริษัทไม่มีข้อตกลงหรือสัญญาใดๆ กับเว็บไซต์อื่นดังกล่าวที่เกี่ยวข้องกับข้อตกลงของท่านกับเว็บไซต์อื่นดังกล่าวนั้น
        </p>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        {!isAtBottom ? (
          <button style={styles.btnScroll} onClick={() => {
            contentRef.current?.scrollTo({
              top: contentRef.current.scrollHeight,
              behavior: "smooth",
            });
            setTimeout(() => setIsAtBottom(true), 500);
          }}>
            เลื่อนไปด้านล่าง
          </button>
        ) : (
          <>
            <button style={styles.btn} onClick={() => router.push("/register")}>
              ยอมรับ
            </button>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <span style={styles.btnReject} onClick={() => router.push("/onboarding/1")}>
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
    padding: "16px 20px 20px",
    fontSize: 14,
    color: "#333",
    lineHeight: 1.75,
  } as React.CSSProperties,
  date: { fontSize: 12, color: "#888", marginBottom: 12 } as React.CSSProperties,
  bold: { fontWeight: 700, marginBottom: 8 } as React.CSSProperties,
  sectionTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: "#111",
    marginTop: 16,
    marginBottom: 6,
  } as React.CSSProperties,
  para: { marginBottom: 10 } as React.CSSProperties,
  footer: {
    position: "sticky",
    bottom: 0,
    padding: "14px 20px 24px",
    background: "#fff",
    boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
    flexShrink: 0,
  } as React.CSSProperties,
  btnScroll: {
  width: "100%",
  padding: "16px",
  background: "#fff",
  color: "#111",
  fontSize: 17,
  fontWeight: 700,
  border: "2px solid #E0E0E0",
  borderRadius: 14,
  cursor: "pointer",
} as React.CSSProperties,
  btn: {
    width: "100%",
    padding: "16px",
    background: "#BE1C74",
    color: "#fff",
    fontSize: 17,
    fontWeight: 700,
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
  } as React.CSSProperties,
  btnReject: {
    color: "#BE1C74",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
};