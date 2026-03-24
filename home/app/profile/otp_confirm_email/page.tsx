'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserProfile } from '@/components/providers/UserProfileProvider';
import { TopBar, FormContainer, OTPInput } from '@/components/profile';
import { maskEmail } from '@/lib/user-profile';

export default function OtpConfirmEmail() {
  const router = useRouter();
  const { profile, confirmEmailChange } = useUserProfile();
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (!profile.pendingEmail) {
      router.replace('/profile/change_email');
    }
  }, [profile.pendingEmail, router]);

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
      confirmEmailChange();
      router.push('/profile/success_email');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerText = timeLeft > 0 
    ? `ขอรหัสใหม่ในอีก ${minutes}:${seconds < 10 ? '0' + seconds : seconds} นาที`
    : 'ขอรหัสใหม่';

  if (!profile.pendingEmail) return null;

  return (
    <div className="app-container bg-white h-full overflow-y-auto">
      <TopBar 
        title="" 
        showBackButton 
        backHref="/profile/change_email" 
      />
      
      <FormContainer
        title="ยืนยันอีเมล"
      >
        <p className="text-[14px] text-[#333] mb-1 font-normal">
          กรอกรหัส OTP 6 หลัก ที่ส่งไปยัง <span className="font-semibold">{maskEmail(profile.pendingEmail)}</span>
        </p>
        <p className="text-[14px] text-[#333] mb-12 font-normal">
          หากยังไม่ได้รับ กดขอรหัสใหม่ได้เมื่อครบกำหนดเวลา
        </p>

        <OTPInput length={6} onComplete={handleComplete} />

        <div className="flex justify-between items-center mt-4">
          <div className="text-[14px] text-[#333]">รหัสอ้างอิง: 3754E9</div>
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
