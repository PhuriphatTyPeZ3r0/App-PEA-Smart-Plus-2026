'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserProfile } from '@/components/providers/UserProfileProvider';
import { TopBar, FormContainer, TextInput, Button } from '@/components/profile';

export default function ChangeEmail() {
  const router = useRouter();
  const { profile, setPendingEmail } = useUserProfile();
  const [newEmail, setNewEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setPendingEmail(newEmail);
      router.push('/profile/otp_confirm_email');
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
        title="เปลี่ยนอีเมล"
        description="กรุณากรอกอีเมลใหม่ของคุณ"
        note="*ระบบจะส่ง OTP ไปยังอีเมลใหม่เพื่อยืนยัน"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="อีเมล ปัจจุบัน"
            value={profile.email}
            readOnly
            disabled
            type="email"
          />

          <TextInput
            placeholder="อีเมล ใหม่"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            type="email"
          />

          <div className="mt-10">
            <Button 
              type="submit" 
              disabled={!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)}
            >
              ยืนยัน
            </Button>
          </div>
        </form>
      </FormContainer>
    </div>
  );
}
