'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserProfile } from '@/components/providers/UserProfileProvider';
import { TopBar, FormContainer, TextInput, Button } from '@/components/profile';

export default function ChangePhone() {
  const router = useRouter();
  const { profile, setPendingPhone } = useUserProfile();
  const [newPhone, setNewPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhone.length === 10) {
      setPendingPhone(newPhone);
      router.push('/profile/otp_confirm');
    }
  };

  return (
    <div className="app-container bg-white h-full overflow-y-auto">
      <TopBar 
        title="" 
        showBackButton 
        backHref="/profile/edit_basic_info" 
      />
      
      <FormContainer
        title="เปลี่ยนเบอร์โทรศัพท์มือถือ"
        description="กรุณากรอกเบอร์โทรศัพท์มือถือใหม่ของคุณ"
        note="*ระบบรองรับเบอร์โทรศัพท์มือถือที่ลงทะเบียนในประเทศไทยเท่านั้น"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="เบอร์โทรศัพท์มือถือ ปัจจุบัน"
            value={profile.phone}
            readOnly
            disabled
          />

          <TextInput
            placeholder="เบอร์โทรศัพท์มือถือ ใหม่"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            maxLength={10}
            type="tel"
          />

          <div className="mt-10">
            <Button 
              type="submit" 
              disabled={newPhone.length !== 10}
            >
              ยืนยัน
            </Button>
          </div>
        </form>
      </FormContainer>
    </div>
  );
}
