'use client';

import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/components/providers/UserProfileProvider';
import { Button } from '@/components/profile';

export default function SuccessPhone() {
  const router = useRouter();
  const { profile } = useUserProfile();

  return (
    <div className="app-container bg-white h-full flex flex-col px-6">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-[280px] h-[280px] mb-8">
          <img 
            src="/images/Gemini_Generated_Image_c0e76ec0e76ec0e7.png" 
            alt="Success" 
            className="w-full h-full object-contain" 
          />
        </div>
        
        <h1 className="text-2xl font-bold text-[#2b3346] mb-4 text-center">
          เปลี่ยนเบอร์โทรศัพท์สำเร็จ
        </h1>
        
        <p className="text-[15px] text-[#888] text-center leading-relaxed">
          หมายเลข <span className="font-semibold text-[#2b3346]">{profile.phone}</span> จะถูกใช้ในการ<br/>เข้าสู่ระบบและยืนยันตัวตนด้วย OTP ในครั้งต่อๆ ไป
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
