"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function SystemErrorPage() {
  const router = useRouter();

  const handleTryAgain = () => {
    // If we have a previous page, try to go back, otherwise go home
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen relative bg-white overflow-hidden font-kanit shadow-lg flex flex-col justify-center">

      <div className="w-full h-full flex flex-col justify-start items-start">
        {/* Graphic Section */}
        <div className="w-full h-80 relative overflow-hidden mt-12 flex items-center justify-center">
            {/* Background Circle Blur */}
            <div className="w-64 h-64 absolute opacity-50 bg-[#FEE4E2] rounded-full blur-[40px]" />
            
            <div className="relative w-72 h-72 z-10 flex items-center justify-center scale-110">
              <img 
                src="/asset/error/system-error.png" 
                alt="System Error" 
                className="w-full h-full object-contain"
              />
            </div>
        </div>

        {/* Text Section */}
        <div className="w-full px-8 flex flex-col justify-start items-center gap-4 mt-8">
          <h1 className="text-[#101828] text-2xl font-bold font-kanit leading-8 text-center">ขออภัย ระบบขัดข้องชั่วคราว</h1>
          <p className="text-[#344054] text-lg font-normal font-kanit leading-7 text-center">
            เรากำลังแก้ไขปัญหานี้อย่างเร่งด่วน ข้อมูลของคุณยังปลอดภัยและไม่สูญหาย กรุณาลองใหม่อีกครั้งในภายหลัง
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-8px_24px_rgba(145,158,171,0.12)] p-6 pb-12 z-50">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleTryAgain}
            className="w-full py-5 bg-[#A80689] text-white rounded-full text-xl font-medium font-kanit shadow-lg active:scale-[0.98] transition-all hover:bg-[#8e0574]"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    </div>
  );
}
