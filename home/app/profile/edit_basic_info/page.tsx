"use client";

import { useUserProfile } from '@/components/providers/UserProfileProvider';
import { TopBar } from '@/components/profile';
import Link from 'next/link';

export default function EditBasicInfo() {
  const { profile } = useUserProfile();

  return (
    <div className="app-container bg-white h-full overflow-y-auto">
      <TopBar 
        title="แก้ไขข้อมูลพื้นฐาน" 
        showBackButton 
        backHref="/profile/personal_info" 
        variant="plain"
        className="border-b border-[#eee]"
      />

      <div className="mt-2">
        <Link href="/profile/change_phone" className="flex justify-between items-center p-5 border-b border-[#eee] hover:bg-gray-50">
          <div className="flex flex-col gap-1">
            <div className="text-[15px] font-semibold text-[#2b2b2b]">เปลี่ยนเบอร์โทรศัพท์มือถือ</div>
            <div className="text-[13px] text-[#666]">{profile.phone}</div>
          </div>
          <span className="material-symbols-outlined text-[#ccc] text-2xl">chevron_right</span>
        </Link>
        
        <Link href="/profile/change_email" className="flex justify-between items-center p-5 border-b border-[#eee] hover:bg-gray-50">
          <div className="flex flex-col gap-1">
            <div className="text-[15px] font-semibold text-[#2b2b2b]">เปลี่ยนอีเมล</div>
            <div className="text-[13px] text-[#666]">{profile.email}</div>
          </div>
          <span className="material-symbols-outlined text-[#ccc] text-2xl">chevron_right</span>
        </Link>
      </div>
    </div>
  );
}
