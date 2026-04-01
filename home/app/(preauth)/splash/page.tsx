"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const REGISTER_COMPLETE_KEY = "register-complete";

/** s-splash — แสดง PEA Logo + bIn animation
 *  - ถ้า register เสร็จแล้ว → redirect → /dashboard (ข้าม onboarding)
 *  - ถ้ายังไม่ได้ register → redirect → /loading → /onboarding/1
 */
export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // ✅ บอก middleware ว่าเคยผ่าน splash แล้ว
      document.cookie = "hasSeenSplash=true; path=/";

      if (sessionStorage.getItem(REGISTER_COMPLETE_KEY) === "true") {
        router.replace("/dashboard");
      } else {
        router.replace("/loading");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <style>{`
        @keyframes bIn {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.1); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .splash-logo {
          animation: bIn 0.6s ease both;
          text-align: center;
        }
      `}</style>

      <div style={styles.container}>
        <div className="splash-logo">
          <Image
            src="/images/(preauth)/pea-logo.png"
            alt="PEA Smart Plus"
            width={333}
            height={169}
            style={{ height: 72, width: "auto", objectFit: "contain" }}
            priority
          />
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
  } as React.CSSProperties,
};
