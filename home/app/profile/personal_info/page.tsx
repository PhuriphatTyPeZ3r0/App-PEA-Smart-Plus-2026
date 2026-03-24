'use client';

import Link from 'next/link';
import { useUserProfile } from '@/components/providers/UserProfileProvider';
import { TopBar, InfoCard } from '@/components/profile';

export default function PersonalInfo() {
  const { profile } = useUserProfile();

  return (
    <div className="app-container page-info bg-[#F9F9FC] h-full overflow-y-auto">
      <TopBar 
        title="ข้อมูลส่วนตัว" 
        showBackButton 
        backHref="/profile" 
      />

      <div className="px-5 py-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl mb-6 border border-[#f2f2f2]">
          <div className="text-[15px] font-semibold text-[#2b2b2b]">แสดงข้อมูลทั้งหมด</div>
          <div className="w-11 h-6 bg-[#e0cae7] rounded-full relative cursor-pointer">
            <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#7b6285] rounded-full transition-all"></div>
          </div>
        </div>

        <InfoCard
          title="ข้อมูลส่วนตัว"
          rows={[
            { label: 'คำนำหน้า', value: profile.title },
            { label: 'ชื่อ', value: profile.firstName },
            { label: 'นามสกุล', value: profile.lastName },
            { label: 'citizen_no', value: profile.citizenNo },
            { label: 'วัน/เดือน/ปีเกิด', value: profile.birthDate },
          ]}
        />

        <InfoCard
          title="ข้อมูลพื้นฐาน"
          editLink="/profile/edit_basic_info"
          rows={[
            { label: 'เบอร์โทรศัพท์', value: profile.phone, icon: 'phone_iphone' },
            { label: 'อีเมล', value: profile.email, icon: 'mail' },
          ]}
        />

        <InfoCard
          title="ที่อยู่"
          rows={[
            { label: 'ที่อยู่ตามทะเบียนบ้าน', value: profile.citizenAddress },
            { label: 'ที่อยู่ปัจจุบัน', value: profile.currentAddress },
          ]}
        />
        
        <div className="pb-24"></div>
      </div>
    </div>
  );
}
