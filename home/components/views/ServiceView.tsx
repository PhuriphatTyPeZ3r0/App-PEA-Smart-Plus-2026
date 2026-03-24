"use client";

import React, { useState } from "react";
import InAppBrowser from "../InAppBrowser";

interface ServiceViewProps {
  onBack: () => void;
}

interface ServiceItem {
  label: string;
  icon: string;
  url?: string;
}

interface ServiceSection {
  section: string;
  items: ServiceItem[];
}

const SECTIONS: ServiceSection[] = [
  {
    section: "จัดการบัญชีและการใช้งาน",
    items: [
      { label: "ประวัติการใช้ไฟฟ้า", icon: "chart" },
      { label: "QR/บาร์โค้ด", icon: "qr" },
      { label: "แจ้งปัญหาไฟฟ้าดับ", icon: "pin", url: "http://localhost:5000" },
      { label: "ดูและจ่ายบิล", icon: "bill" },
      { label: "ดูการใช้ไฟฟ้าปัจจุบัน", icon: "bolt" },
      { label: "ประมาณการค่าไฟฟ้า", icon: "graph" },
      { label: "แก้ไขที่อยู่", icon: "user" },
      { label: "ศูนย์ช่วยเหลือ", icon: "headset" },
    ],
  },
  {
    section: "บริการด้านการใช้ไฟฟ้า",
    items: [
      { label: "เปลี่ยนขนาดมิเตอร์ (เพิ่ม/ลด)", icon: "meter-change" },
      { label: "โอนเปลี่ยนเจ้าของ", icon: "transfer" },
      { label: "ระงับการใช้ไฟฟ้าชั่วคราว", icon: "plug-lock" },
      { label: "ยกเลิกการใช้ไฟฟ้า", icon: "bolt-cancel" },
    ],
  },
  {
    section: "บริการอื่น ๆ ที่คุณอาจสนใจ",
    items: [
      { label: "ติดตั้ง Solar Rooftop", icon: "solar", url: "https://peasolar.pea.co.th" },
      { label: "Watt-D Point", icon: "watt", url: "https://peavoltaev.pea.co.th" },
    ],
  },
];

// All icons render white on gradient background, solar/watt use gold
function IconSVG({ icon }: { icon: string }) {
  const W = "white";

  const icons: Record<string, React.ReactNode> = {
    chart: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[8px]">
        <rect x="3" y="21" width="6" height="15" rx="2" fill={W} />
        <rect x="12" y="13" width="6" height="23" rx="2" fill={W} />
        <rect x="21" y="17" width="6" height="19" rx="2" fill={W} />
        <rect x="30" y="7" width="6" height="29" rx="2" fill={W} />
        <path d="M6 24L15 16L24 20L33 9" stroke={W} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    ),
    qr: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[7px]">
        <rect x="3" y="3" width="14" height="14" rx="2.5" stroke={W} strokeWidth="2.5" />
        <rect x="6.5" y="6.5" width="7" height="7" rx="1" fill={W} />
        <rect x="23" y="3" width="14" height="14" rx="2.5" stroke={W} strokeWidth="2.5" />
        <rect x="26.5" y="6.5" width="7" height="7" rx="1" fill={W} />
        <rect x="3" y="23" width="14" height="14" rx="2.5" stroke={W} strokeWidth="2.5" />
        <rect x="6.5" y="26.5" width="7" height="7" rx="1" fill={W} />
        <rect x="23" y="23" width="5" height="5" rx="1" fill={W} />
        <rect x="30" y="23" width="5" height="5" rx="1" fill={W} />
        <rect x="23" y="30" width="5" height="5" rx="1" fill={W} />
        <rect x="30" y="30" width="5" height="5" rx="1" fill={W} />
      </svg>
    ),
    pin: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[5px]">
        <path d="M20 2C13.373 2 8 7.373 8 14C8 23 20 38 20 38C20 38 32 23 32 14C32 7.373 26.627 2 20 2Z" fill={W} />
        <circle cx="20" cy="14" r="5" fill="none" stroke="#D020B0" strokeWidth="2.5" />
      </svg>
    ),
    bill: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[6px]">
        <rect x="5" y="3" width="23" height="31" rx="3.5" fill={W} opacity="0.9" />
        <rect x="9" y="9" width="14" height="2.5" rx="1.25" fill="#D020B0" />
        <rect x="9" y="15" width="10" height="2.5" rx="1.25" fill="#D020B0" opacity="0.6" />
        <rect x="9" y="21" width="12" height="2.5" rx="1.25" fill="#D020B0" opacity="0.6" />
        <circle cx="30" cy="29" r="8" fill="white" />
        <path d="M27 29L29.5 31.5L34 26.5" stroke="#A80689" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bolt: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[6px]">
        <path d="M24 2L10 22H21L18 38L31 18H20L24 2Z" fill={W} />
      </svg>
    ),
    graph: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[6px]">
        <path d="M4 32L14 17L22 24L32 9" stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="4" cy="32" r="3.5" fill={W} />
        <circle cx="14" cy="17" r="3.5" fill={W} />
        <circle cx="22" cy="24" r="3.5" fill={W} />
        <circle cx="32" cy="9" r="3.5" fill={W} />
      </svg>
    ),
    user: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[6px]">
        <circle cx="20" cy="12" r="8" fill={W} />
        <path d="M4 36C4 27.163 11.163 20 20 20C28.837 20 36 27.163 36 36" stroke={W} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
    headset: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[6px]">
        <path d="M7 21C7 13.268 12.925 7 20 7C27.075 7 33 13.268 33 21" stroke={W} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="4" y="19" width="7" height="11" rx="3.5" fill={W} />
        <rect x="29" y="19" width="7" height="11" rx="3.5" fill={W} />
        <path d="M33 31C33 34.5 30 37 26 37H22" stroke={W} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="37" r="2.5" fill={W} />
      </svg>
    ),
    "meter-change": (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[5px]">
        <rect x="2" y="10" width="28" height="22" rx="4" fill={W} opacity="0.2" stroke={W} strokeWidth="2" />
        <path d="M11 21H27" stroke={W} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M21 16L27 21L21 26" stroke={W} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 16L11 21L17 26" stroke={W} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="33" cy="12" r="7" fill={W} />
        <path d="M30 12H36M33 9V15" stroke="#C020A0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    transfer: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[7px]">
        <path d="M10 16H30M25 11L30 16L25 21" stroke={W} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 25H10M15 20L10 25L15 30" stroke={W} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "plug-lock": (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[6px]">
        <path d="M14 3V10M26 3V10" stroke={W} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M7 10H33V19C33 26.18 27.18 32 20 32C12.82 32 7 26.18 7 19V10Z" stroke={W} strokeWidth="2.5" />
        <path d="M20 32V38" stroke={W} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 38H26" stroke={W} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="17" y="17" width="6" height="8" rx="2" fill={W} opacity="0.8" />
        <circle cx="20" cy="17" r="2" fill={W} />
      </svg>
    ),
    "bolt-cancel": (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[6px]">
        <path d="M21 2L10 20H19L17 34L28 16H19L21 2Z" fill={W} opacity="0.9" />
        <circle cx="31" cy="31" r="8" fill={W} opacity="0.25" stroke={W} strokeWidth="1.5" />
        <path d="M28 28L34 34M34 28L28 34" stroke={W} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    solar: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[5px]">
        <rect x="4" y="23" width="32" height="13" rx="3" fill="#F59E0B" />
        <rect x="4" y="23" width="32" height="5" rx="2" fill="#FBBF24" />
        <line x1="20" y1="23" x2="20" y2="36" stroke="#D97706" strokeWidth="1.5" />
        <line x1="4" y1="29" x2="36" y2="29" stroke="#D97706" strokeWidth="1.5" />
        <circle cx="20" cy="13" r="6" fill="#FCD34D" />
        <path d="M20 3V6M20 20V23M10 13H7M33 13H30M13.5 6.5L11.5 4.5M28.5 21.5L30.5 23.5M13.5 19.5L11.5 21.5M28.5 6.5L30.5 4.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    watt: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-[4px]">
        <circle cx="20" cy="20" r="17" fill="#FCD34D" />
        <circle cx="20" cy="20" r="13" fill="#FBBF24" />
        <path d="M23 9L12 22H21L19 31L28 18H19L23 9Z" fill="white" />
      </svg>
    ),
  };

  return <>{icons[icon] ?? <span className="text-xl text-white">⚡</span>}</>;
}

function ServiceIconButton({ item, onClick }: { item: ServiceItem; onClick: () => void }) {
  const isGold = item.icon === "solar" || item.icon === "watt";

  const bg = isGold
    ? "bg-amber-50"
    : "bg-gradient-to-br from-[#FF44DB] to-[#A80689] shadow-[0_6px_16px_-4px_rgba(168,6,137,0.4)]";

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2.5 transition active:scale-95">
      <div className={`flex h-[60px] w-[60px] items-center justify-center rounded-2xl ${bg}`}>
        <IconSVG icon={item.icon} />
      </div>
      <span className="max-w-[72px] text-center text-[11px] font-medium leading-[1.35] text-[#1A1A2E]">
        {item.label}
      </span>
    </button>
  );
}

export default function ServiceView({ onBack }: ServiceViewProps) {
  const [browser, setBrowser] = useState<{ url: string; title: string } | null>(null);

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center gap-3 bg-white px-5 pb-4 pt-12 sm:px-6">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 transition active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">บริการทั้งหมด</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {SECTIONS.map((sec, si) => (
          <div key={sec.section}>
            {si > 0 && <div className="h-3 bg-[#F1F5F9]" />}
            <div className="bg-white px-5 py-6 sm:px-6">
              <h2 className="mb-7 text-lg font-bold text-[#1A1A2E]">{sec.section}</h2>
              <div className="grid grid-cols-4 gap-x-3 gap-y-7">
                {sec.items.map((item) => (
                  <ServiceIconButton
                    key={item.label}
                    item={item}
                    onClick={() => item.url && setBrowser({ url: item.url, title: item.label })}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* In-app browser */}
      {browser && (
        <InAppBrowser url={browser.url} title={browser.title} onClose={() => setBrowser(null)} />
      )}
    </div>
  );
}