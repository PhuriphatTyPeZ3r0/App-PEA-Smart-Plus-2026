"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface OnboardingLayoutProps {
  /** หมายเลข dot ที่ active (0-based, รวม 5 จุด) */
  activeDot: number;
  title: string;
  description: string;
  illustration: React.ReactNode;
  nextRoute: string;
  nextLabel?: string;
  skipRoute?: string;
}

const TOTAL_DOTS = 4;
const DOT_COLOR_INACTIVE = "#E0B0D8";
const DOT_COLOR_ACTIVE = "#8B1A6B";
const PP2_COLOR = "#C4307A";

/**
 * OnboardingLayout — shared wrapper สำหรับ s-ob1 ถึง s-ob4
 * แยก UI ออกจาก logic ของแต่ละหน้า
 */
export default function OnboardingLayout({
  activeDot,
  title,
  description,
  illustration,
  nextRoute,
  nextLabel = "ถัดไป",
  skipRoute,
}: OnboardingLayoutProps) {
  const router = useRouter();

  useEffect(() => {
  if (activeDot === TOTAL_DOTS - 1) return;

  const timer = setTimeout(() => {
    router.push(nextRoute);
  }, 3000);

  return () => clearTimeout(timer);
}, [nextRoute, router, activeDot]);

  return (
    <div style={styles.screen}>
      {/* Status bar spacer */}
      <div style={styles.statusBar} />

      {/* Illustration area */}
      <div style={styles.content}>
        <div style={styles.illustrationWrapper}>{illustration}</div>

        <h2 style={styles.title}>{title}</h2>
        <p
          style={styles.description}
          dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, "<br/>") }}
        />
      </div>

      {/* Dots + Buttons */}
      <div style={styles.footer}>
        {/* Progress dots */}
        <div style={styles.dotsRow}>
          {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeDot ? 24 : 8,
                height: 8,
                borderRadius: i === activeDot ? 4 : "50%",
                background: i === activeDot ? DOT_COLOR_ACTIVE : DOT_COLOR_INACTIVE,
                transition: "all .3s",
              }}
            />
          ))}
        </div>

        {/* Primary button */}
        <button style={styles.primaryBtn} onClick={() => router.push(nextRoute)}>
          {nextLabel}
        </button>

        {/* Skip */}
        {skipRoute && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <span
              style={styles.skipText}
              onClick={() => router.push(skipRoute)}
              role="button"
            >
              ข้าม
            </span>
          </div>
        )}
      </div>

      <style>{`
        button:active { transform: scale(0.97); }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
  },
  statusBar: {
    height: 50,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 32px 20px",
  },
  illustrationWrapper: {
    width: 260,
    height: 260,
    position: "relative",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: "#111",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 1.7,
  },
  footer: {
    padding: "0 24px 36px",
    flexShrink: 0,
  },
  dotsRow: {
    display: "flex",
    gap: 6,
    justifyContent: "center",
    marginBottom: 28,
  },
  primaryBtn: {
    width: "100%",
    height: 56,
    background: "linear-gradient(135deg, #C4307A, #8B1A6B)",
    color: "#fff",
    border: "none",
    borderRadius: 28,
    fontFamily: "inherit",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(139,26,107,.35)",
    transition: "all .15s",
    letterSpacing: ".3px",
    marginBottom: 0,
  },
  skipText: {
    color: PP2_COLOR,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
};
