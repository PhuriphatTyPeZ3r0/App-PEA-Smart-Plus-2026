"use client";

import React, { useEffect, useState } from "react";
import LoadingView from "@/components/views/LoadingView";
import HomeView from "@/components/views/HomeView";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { profile } = useUserProfile();
  const router = useRouter();
  // ใช้ sessionStorage เพื่อแสดงโหลดแค่ครั้งแรกของ session
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("hasLoadedHome") !== "true";
    }
    return true;
  });

  const sharedUser = {
    id: profile.id,
    idenNumber: profile.idenNumber,
    name: profile.fullName,
    balance: profile.balance,
    ca: profile.ca,
    accountName: profile.accountName,
    dueDate: profile.dueDate,
    newServiceLocationCount: profile.newServiceLocationCount,
  };

  useEffect(() => {
    localStorage.setItem("UserAccIdenNumber", profile.idenNumber);
    localStorage.setItem("SetLanguage", "TH");

    // ถ้ายังไม่เคยเข้า Home ใน session นี้ ให้แสดงโหลด แล้ว set flag
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasLoadedHome", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [profile.idenNumber, loading]);

  useEffect(() => {
    if (!loading) {
      const hasShown = sessionStorage.getItem("hasShownEvaluation");
      if (!hasShown) {
        const timer = setTimeout(() => {
          sessionStorage.setItem("hasShownEvaluation", "true");
          router.push("/evaluation");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, router]);

  if (loading) {
    return <LoadingView />;
  }

  return (
    <HomeView
      mockUser={sharedUser}
      isActive={true}
      onOpenEvaluation={() => router.push("/evaluation")}
      onOpenNotifications={() => router.push("/notification")}
      onOpenServiceAll={() => router.push("/service-all")}
    />
  );
}