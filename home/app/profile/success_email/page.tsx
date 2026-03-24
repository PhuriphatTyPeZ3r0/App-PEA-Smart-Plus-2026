'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/profile';

export default function SuccessEmail() {
  const router = useRouter();

  return (
    <div className="app-container bg-white h-full flex flex-col px-6">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-[160px] h-[160px] bg-[#e5f9f0] rounded-full flex justify-center items-center p-6 mb-8">
          <div className="w-full h-full bg-[#47c48f] rounded-full flex justify-center items-center shadow-lg">
            <span className="material-symbols-outlined text-[70px] text-white font-bold">check</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-[#000000] mb-4 text-center">
          เพิ่มอีเมลสำเร็จ
        </h1>
        
        <p className="text-[15px] text-[#555] text-center leading-relaxed">
          เราได้อัปเดตอีเมลใหม่ของคุณเรียบร้อยแล้ว
        </p>
      </div>

      <div className="pb-10">
        <Button onClick={() => router.push('/profile/personal_info')}>
          ตกลง
        </Button>
      </div>
    </div>
  );
}
