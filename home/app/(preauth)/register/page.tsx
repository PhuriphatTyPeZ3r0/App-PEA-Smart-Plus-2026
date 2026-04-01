"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/** s-register — สมัครบัญชีผู้ใช้งานใหม่
 *  กรอกเบอร์โทรศัพท์ → /otp
 */
export default function RegisterPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const isValid = phone.length === 10;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
  };

  const handleNext = () => {
    if (!isValid) return;
    // เก็บเบอร์ไว้ใช้ใน OTP
    sessionStorage.setItem("register-phone", phone);
    router.push("/otp");
  };

  return (
    <div style={styles.container}>
      {/* Status bar placeholder */}
      <div style={{ flexShrink: 0, height: 8 }} />

      {/* Back */}
      <div style={{ padding: "6px 8px 0", flexShrink: 0 }}>
        <button style={styles.back} onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <Image
            src="/images/(preauth)/pea-logo.png"
            alt="PEA Smart Plus"
            width={333}
            height={169}
            style={{ height: 44, width: "auto", objectFit: "contain" }}
            priority
          />
        </div>

        <h2 style={styles.heading}>สมัครบัญชีผู้ใช้งานใหม่</h2>
        <p style={styles.sub}>
          กรุณากรอกหมายเลขโทรศัพท์<br />
          เพื่อใช้ในการยืนยันตัวตนและเข้าใช้งานระบบ
        </p>

        {/* Phone input */}
        <div style={styles.inputWrap}>
          {phone.length > 0 && (
            <span style={styles.label}>หมายเลขโทรศัพท์</span>
          )}
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="หมายเลขโทรศัพท์"
            maxLength={10}
            style={styles.input}
          />
        </div>

        <button
          style={{
            ...styles.btn,
            background: isValid
              ? "linear-gradient(135deg, #C4307A, #8B1A6B)"
              : "#ccc",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
          disabled={!isValid}
          onClick={handleNext}
        >
          ถัดไป
        </button>

        <p style={styles.loginRow}>
          มีบัญชีอยู่แล้ว?{" "}
          <span style={styles.loginLink}>เข้าสู่ระบบ</span>
        </p>
      </div>

      {/* Footer links */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          <span style={styles.footerLink}>ข้อตกลงและเงื่อนไขการใช้บริการ</span>
        </p>
        <p style={styles.footerText}>
          และ <span style={styles.footerLink}>นโยบายความคุ้มครองข้อมูลส่วนบุคคล</span>
        </p>
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
  back: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
  } as React.CSSProperties,
  content: {
    flex: 1,
    padding: "16px 24px 20px",
    overflowY: "auto",
  } as React.CSSProperties,
  heading: {
    fontSize: 24,
    fontWeight: 800,
    color: "#111",
    marginBottom: 8,
  } as React.CSSProperties,
  sub: {
    fontSize: 14,
    color: "#666",
    lineHeight: 1.6,
    marginBottom: 28,
  } as React.CSSProperties,
  inputWrap: {
    position: "relative",
    marginBottom: 20,
  } as React.CSSProperties,
  label: {
    fontSize: 12,
    color: "#8B1A6B",
    position: "absolute",
    top: -7,
    left: 14,
    background: "#fff",
    padding: "0 4px",
    fontWeight: 600,
  } as React.CSSProperties,
  input: {
    width: "100%",
    height: 56,
    fontSize: 18,
    padding: "0 16px",
    border: "1.5px solid #ddd",
    borderRadius: 12,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  } as React.CSSProperties,
  btn: {
    width: "100%",
    padding: "16px",
    color: "#fff",
    fontSize: 17,
    fontWeight: 700,
    border: "none",
    borderRadius: 14,
  } as React.CSSProperties,
  loginRow: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginTop: 20,
  } as React.CSSProperties,
  loginLink: {
    color: "#8B1A6B",
    fontWeight: 700,
    cursor: "pointer",
  } as React.CSSProperties,
  footer: {
    padding: "0 24px 32px",
    flexShrink: 0,
    textAlign: "center",
  } as React.CSSProperties,
  footerText: {
    fontSize: 13,
    color: "#888",
    margin: 0,
  } as React.CSSProperties,
  footerLink: {
    color: "#C4307A",
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
};
