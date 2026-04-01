"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import loadingAnimation from "@/public/asset/loading/loading-2.json";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding/1");
    }, 2200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={styles.container}>
      <Lottie
        animationData={loadingAnimation}
        loop
        style={{ width: 96, height: 96 }}
      />
    </div>
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
