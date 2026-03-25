"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function NoInternetPage() {
  const router = useRouter();

  const handleTryAgain = () => {
    // If we are online, go back, otherwise stay
    if (navigator.onLine) {
      if (window.history.length > 2) {
        router.back();
      } else {
        router.push('/');
      }
    } else {
      alert("กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen relative bg-white overflow-hidden font-kanit shadow-lg flex flex-col justify-center">

      <div className="flex-1 flex flex-col justify-start items-start">
        {/* Graphic Section */}
        <div className="w-full h-80 relative overflow-hidden mt-12 flex items-center justify-center">
            {/* Background Circle Blur */}
            <div className="w-64 h-64 absolute opacity-50 bg-[#FEE4E2] rounded-full blur-[40px]" />
            
            <div className="relative w-72 h-72 z-10 flex items-center justify-center scale-110">
              <img 
                src="/asset/error/no-internet.png" 
                alt="No Internet" 
                className="w-full h-full object-contain"
              />
            </div>
        </div>

        {/* Text Section */}
        <div className="w-full px-8 flex flex-col justify-start items-center gap-4 mt-8">
          <h1 className="text-[#101828] text-2xl font-bold font-kanit leading-8 text-center">ไม่สามารถเชื่อมต่อเครือข่ายได้</h1>
          <p className="text-[#344054] text-lg font-normal font-kanit leading-7 text-center">
            กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ แล้วลองใหม่อีกครั้ง
          </p>
        </div>
      </div>

      {/* Button Section */}
      <div className="w-full p-6 pb-12 bg-white">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleTryAgain}
            className="w-full py-5 bg-[#A80689] text-white rounded-full text-xl font-medium font-kanit shadow-lg active:scale-[0.98] transition-all hover:bg-[#8e0574] border border-white/10"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    </div>
  );
}
