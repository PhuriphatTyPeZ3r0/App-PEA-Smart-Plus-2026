// app/page.tsx  ← ROOT HOME PAGE
"use client";

import React, { useEffect, useRef, useState } from "react";
import LoadingView from "@/components/views/LoadingView";
import HomeView from "@/components/views/HomeView";
import HomeTutorialOverlay from "@/components/tutorial/HomeTutorialOverlay";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { useRouter } from "next/navigation";

const HOME_TUTORIAL_KEY = "pea-smart-plus-home-tutorial-shown";

export default function HomePage() {
  const { profile, isHomeLoaded, setHomeLoaded } = useUserProfile();
  const router = useRouter();

  // null = "not yet checked" (avoids SSR mismatch)
  const [preauthPassed, setPreauthPassed] = useState<boolean | null>(null);
  const [loading, setLoading]             = useState(!isHomeLoaded);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasCheckedTutorial, setHasCheckedTutorial] = useState(false);
  const evalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── GUARD: runs only on client, avoids SSR sessionStorage crash ──────────
  useEffect(() => {
    const passed = sessionStorage.getItem("hasSeenSplash") === "true";
    setPreauthPassed(passed);
    if (!passed) {
      router.replace("/splash");
    }
  }, [router]);

  // ─── HOME LOADING TIMER ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isHomeLoaded) {
      const t = setTimeout(() => {
        setLoading(false);
        setHomeLoaded(true);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [isHomeLoaded, setHomeLoaded]);

  // ─── TUTORIAL CHECK (runs after loading done) ─────────────────────────────
  useEffect(() => {
    if (!loading) {
      const seen = localStorage.getItem(HOME_TUTORIAL_KEY) === "true";
      setIsTutorialOpen(!seen);
      setHasCheckedTutorial(true);
    }
  }, [loading]);

  // ─── EVALUATION AUTO-REDIRECT ─────────────────────────────────────────────
  useEffect(() => {
    if (!loading && hasCheckedTutorial && !isTutorialOpen) {
      const alreadyShown = sessionStorage.getItem("hasShownEvaluation");
      if (!alreadyShown) {
        evalTimerRef.current = setTimeout(() => {
          sessionStorage.setItem("hasShownEvaluation", "true");
          router.push("/evaluation");
        }, 1500);
      }
    }
    return () => {
      if (evalTimerRef.current) clearTimeout(evalTimerRef.current);
    };
  }, [hasCheckedTutorial, isTutorialOpen, loading, router]);

  // ─── SHARED USER OBJECT ───────────────────────────────────────────────────
  const sharedUser = {
    id: profile.id,
    idenNumber: profile.idenNumber,
    name: `คุณ${profile.firstName}`,
    balance: profile.balance,
    ca: profile.ca,
    accountName: profile.accountName,
    dueDate: profile.dueDate,
    newServiceLocationCount: profile.newServiceLocationCount,
  };

  // ─── PERSIST USER SETTINGS ────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("UserAccIdenNumber", profile.idenNumber);
    localStorage.setItem("SetLanguage", "TH");
  }, [profile.idenNumber]);

  // ─── RENDER GUARD ─────────────────────────────────────────────────────────
  // preauthPassed===null means we're still on first render (SSR or before effect)
  if (preauthPassed === null || loading) {
    return <LoadingView />;
  }

  // If not passed, guard effect already called router.replace("/splash") above
  // Render nothing while redirect is in flight
  if (!preauthPassed) return null;

  const handleCompleteTutorial = () => {
    localStorage.setItem(HOME_TUTORIAL_KEY, "true");
    sessionStorage.setItem("hasShownEvaluation", "true");
    setIsTutorialOpen(false);
    router.push("/evaluation");
  };

  return (
    <>
      <HomeView
        mockUser={sharedUser}
        isActive={!isTutorialOpen}
        onOpenEvaluation={() => router.push("/evaluation")}
        onOpenNotifications={() => router.push("/notification")}
        onOpenServiceAll={() => router.push("/service-all")}
      />
      {isTutorialOpen && <HomeTutorialOverlay onComplete={handleCompleteTutorial} />}
    </>
  );
}