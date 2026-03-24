'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserProfile } from '@/components/providers/UserProfileProvider';
import { TopBar, FormContainer, OTPInput, Button } from '@/components/profile';
import { maskPhoneForOtp } from '@/lib/user-profile';

export default function OtpConfirm() {
  const router = useRouter();
  const { profile, confirmPhoneChange } = useUserProfile();
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (!profile.pendingPhone) {
      router.replace('/profile/change_phone');
    }
  }, [profile.pendingPhone, router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleComplete = (otp: string) => {
    // Simulate OTP verification
    if (otp === '123456') {
      confirmPhoneChange();
      router.push('/profile/success_phone');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerText = timeLeft > 0 
    ? `ขอรหัสใหม่ในอีก ${minutes}:${seconds < 10 ? '0' + seconds : seconds} นาที`
    : 'ขอรหัสใหม่';

  if (!profile.pendingPhone) return null;

  return (
    <div className="app-container bg-white h-full overflow-y-auto">
      <TopBar 
        title="" 
        showBackButton 
        backHref="/profile/change_phone" 
      />
      
      <FormContainer
        title="ยืนยันหมายเลขโทรศัพท์"
      >
        <p className="text-[14px] text-[#333] mb-1 font-normal">
          กรอกรหัส OTP 6 หลัก ที่ส่งไปยัง <span className="font-semibold">{maskPhoneForOtp(profile.pendingPhone)}</span>
        </p>
        <p className="text-[14px] text-[#333] mb-12 font-normal">
          หากยังไม่ได้รับ กดขอรหัสใหม่ได้เมื่อครบกำหนดเวลา
        </p>

        <OTPInput length={6} onComplete={handleComplete} />

        <div className="flex justify-between items-center mt-4">
          <div className="text-[14px] text-[#333]">รหัสอ้างอิง: 16DD8D</div>
          <button 
            className={`text-[14px] font-semibold ${timeLeft > 0 ? 'text-[#db5b94]' : 'text-[#84328f]'}`}
            onClick={() => timeLeft === 0 && setTimeLeft(180)}
            disabled={timeLeft > 0}
          >
            {timerText}
          </button>
        </div>
      </FormContainer>
    </div>
  );
}
