"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 6;
const TIMER_START = 179; // 2:59

/** สุ่ม ref code 6 หลัก (ตัวอักษร + ตัวเลข) */
function generateRefCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // เพิ่มตัวเลข 0-9 เข้าไป
  return Array.from({ length: 6 }, () => // ปรับความยาวจาก 4 เป็น 6
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function maskPhone(raw: string): string {
  if (raw.length < 9) return "+66";
  const intl = "+66" + raw.slice(1);
  const prefix = intl.slice(0, 5);
  const suffix = intl.slice(-2);
  const stars = "*".repeat(intl.length - 7);
  return prefix + stars + suffix;
}

function formatTimer(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/** s-otp — ยืนยันหมายเลขโทรศัพท์ด้วย OTP 6 หลัก
 *  กรอกครบ → /nationality
 */
export default function OtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const [phoneDisplay, setPhoneDisplay] = useState("+66");
  // ref code สุ่มครั้งเดียวตอน mount
  const [refCode] = useState(() => generateRefCode());
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // แสดงเบอร์โทร mask
  useEffect(() => {
    const raw = sessionStorage.getItem("register-phone") || "";
    setPhoneDisplay(maskPhone(raw));
  }, []);

  // countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const handleInput = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }

    // ครบ 6 หลัก → navigate
    if (next.every((d) => d !== "")) {
      setTimeout(() => router.push("/nationality"), 300);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <div style={styles.container}>
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
        <h2 style={styles.heading}>ยืนยันหมายเลขโทรศัพท์</h2>
        <p style={styles.sub}>
          กรอกรหัส OTP 6 หลัก ที่ส่งไปยัง{" "}
          <span style={{ fontWeight: 700, color: "#333" }}>{phoneDisplay}</span>
          <br />
          หากยังไม่ได้รับ กดขอรหัสใหม่ได้เมื่อครบกำหนดเวลา
        </p>

        {/* OTP boxes */}
        <div style={styles.otpRow}>
          {otp.map((val, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                ...styles.otpBox,
                borderColor: val ? "#8B1A6B" : "#ddd",
                color: val ? "#8B1A6B" : "#111",
              }}
            />
          ))}
        </div>

        {/* Ref + Timer */}
        <div style={styles.infoRow}>
          <span style={{ fontSize: 13, color: "#888" }}>
            รหัสอ้างอิง:{" "}
            <span style={{ fontWeight: 700, color: "#333" }}>{refCode}</span>
          </span>
          <span style={{ fontSize: 13, color: "#888" }}>
            ขอรหัสใหม่ในอีก{" "}
            <span style={{ color: "#C4307A", fontWeight: 700 }}>
              {formatTimer(timeLeft)}
            </span>{" "}
            นาที
          </span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
  },
  back: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: "16px 24px 20px",
    overflowY: "auto",
  },
  heading: {
    fontSize: 24,
    fontWeight: 800,
    color: "#111",
    marginBottom: 10,
  },
  sub: {
    fontSize: 14,
    color: "#666",
    lineHeight: 1.6,
    marginBottom: 32,
  },
  otpRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginBottom: 24,
  },
  otpBox: {
    width: 46,
    height: 54,
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
    border: "1.5px solid #ddd",
    borderRadius: 10,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color .2s",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
