"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type TutorialStep = {
  selector: string;
  text: string;
  padding?: number;
};

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type CardPosition = {
  top: number;
  left: number;
  width: number;
};

const STEPS: TutorialStep[] = [
  {
    selector: '[data-tutorial="home-notification"]',
    text: "สามารถดูการแจ้งเตือนสำคัญต่าง ๆ ของคุณได้จากตรงนี้",
  },
  {
    selector: '[data-tutorial="payment-card"]',
    text: "เริ่มต้นการใช้งานเพื่อจัดการบิลและชำระค่าไฟฟ้าของคุณได้จากการ์ดนี้",
  },
  {
    selector: '[data-tutorial="quick-actions"]',
    text: "เมนูลัดสำหรับการใช้งานหลัก เช่น ดูบิล ดูการใช้ไฟ และแจ้งไฟฟ้าขัดข้อง",
  },
  {
    selector: '[data-tutorial="privileges-section"]',
    text: "ส่วนนี้แสดงสิทธิพิเศษและบริการแนะนำที่เกี่ยวข้องกับการใช้งานของคุณ",
  },
  {
    selector: '[data-tutorial="bottom-nav"]',
    text: "เมนูด้านล่างใช้สลับไปยังหน้าหลัก บริการ พอยต์ และโปรไฟล์ได้อย่างรวดเร็ว",
    padding: 6,
  },
];

const CARD_HEIGHT = 196;

interface HomeTutorialOverlayProps {
  onComplete: () => void;
}

export default function HomeTutorialOverlay({ onComplete }: HomeTutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null);
  const [cardPosition, setCardPosition] = useState<CardPosition | null>(null);

  const totalSteps = STEPS.length;
  const activeStep = useMemo(() => STEPS[currentStep], [currentStep]);

  const updatePositions = useCallback(() => {
    const target = document.querySelector(activeStep.selector) as HTMLElement | null;
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: currentStep === totalSteps - 1 ? "end" : "center",
      inline: "nearest",
    });

    window.setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const padding = activeStep.padding ?? 10;
      const nextHighlightRect = {
        top: Math.max(8, rect.top - padding),
        left: Math.max(8, rect.left - padding),
        width: Math.max(48, rect.width + padding * 2),
        height: Math.max(48, rect.height + padding * 2),
      };

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const cardWidth = Math.min(340, viewportWidth - 32);
      const preferredTop = rect.bottom + 20;
      const fallbackTop = rect.top - CARD_HEIGHT - 20;
      const cardTop =
        preferredTop + CARD_HEIGHT <= viewportHeight - 16
          ? preferredTop
          : Math.max(16, fallbackTop);
      const centeredLeft = rect.left + rect.width / 2 - cardWidth / 2;
      const clampedLeft = Math.min(Math.max(16, centeredLeft), viewportWidth - cardWidth - 16);

      setHighlightRect(nextHighlightRect);
      setCardPosition({
        top: cardTop,
        left: clampedLeft,
        width: cardWidth,
      });
    }, 260);
  }, [activeStep, currentStep, totalSteps]);

  useEffect(() => {
    updatePositions();
    const handleResize = () => updatePositions();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updatePositions]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleBack = () => {
    setCurrentStep((previous) => Math.max(0, previous - 1));
  };

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      onComplete();
      return;
    }

    setCurrentStep((previous) => Math.min(totalSteps - 1, previous + 1));
  };

  if (!highlightRect || !cardPosition) {
    return (
      <div className="fixed inset-0 z-[220] bg-black/70" aria-hidden="true" />
    );
  }

  return (
    <div className="fixed inset-0 z-[220]" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/20" />

      <div
        className="absolute rounded-[24px] border border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.72)] transition-all duration-300"
        style={{
          top: highlightRect.top,
          left: highlightRect.left,
          width: highlightRect.width,
          height: highlightRect.height,
        }}
      />

      <div
        className="absolute rounded-[24px] bg-[#111111] p-5 text-white shadow-2xl transition-all duration-300"
        style={{
          top: cardPosition.top,
          left: cardPosition.left,
          width: cardPosition.width,
        }}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
            <Image
              src="/asset/tutorial/Watt-D%20Point.png"
              alt="Tutorial"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </div>

          <p className="pt-1 text-sm leading-6 text-white/95">{activeStep.text}</p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xs text-white/55">
            {currentStep + 1} / {totalSteps}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              กลับ
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-[#A80689] px-4 py-2 text-sm font-medium text-white transition active:scale-95"
            >
              {currentStep === totalSteps - 1 ? "เริ่มใช้งาน" : "ถัดไป"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
