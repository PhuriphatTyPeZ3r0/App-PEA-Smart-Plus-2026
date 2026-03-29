"use client";

import React, { useEffect, useState } from "react";
import LoadingView from "@/components/views/LoadingView";
import HomeView from "@/components/views/HomeView";
import HomeTutorialOverlay from "@/components/tutorial/HomeTutorialOverlay";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { useRouter } from "next/navigation";

const HOME_TUTORIAL_STORAGE_KEY = "pea-smart-plus-home-tutorial-shown";

export default function HomePage() {
  const { profile, isHomeLoaded, setHomeLoaded } = useUserProfile();
  const router = useRouter();
  const [loading, setLoading] = useState(!isHomeLoaded);
  const [mounted, setMounted] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasCheckedTutorial, setHasCheckedTutorial] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isHomeLoaded) {
      const timer = setTimeout(() => {
        setLoading(false);
        setHomeLoaded(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isHomeLoaded, setHomeLoaded]);

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

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("UserAccIdenNumber", profile.idenNumber);
      localStorage.setItem("SetLanguage", "TH");
    }
  }, [profile.idenNumber, mounted]);

  useEffect(() => {
    if (mounted && !loading) {
      const hasSeenTutorial = localStorage.getItem(HOME_TUTORIAL_STORAGE_KEY) === "true";
      setIsTutorialOpen(!hasSeenTutorial);
      setHasCheckedTutorial(true);
    }
  }, [loading, mounted]);

  useEffect(() => {
    if (mounted && !loading && hasCheckedTutorial && !isTutorialOpen) {
      const hasShown = sessionStorage.getItem("hasShownEvaluation");
      if (!hasShown) {
        const timer = setTimeout(() => {
          sessionStorage.setItem("hasShownEvaluation", "true");
          router.push("/evaluation");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [hasCheckedTutorial, isTutorialOpen, loading, router, mounted]);

  if (!mounted || loading) {
    return <LoadingView />;
  }

  const handleCompleteTutorial = () => {
    localStorage.setItem(HOME_TUTORIAL_STORAGE_KEY, "true");
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
