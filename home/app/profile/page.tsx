"use client";

import Link from 'next/link';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { useUserProfile } from '@/components/providers/UserProfileProvider';

export default function AccountPage() {
  // สมมติว่ามี UserProfileProvider ห่อหุ้มหน้านี้อยู่ใน layout file
  const { profile } = useUserProfile();

  return (
    <div className="app-container page-account bg-white h-full overflow-y-auto">
      <ProfileHeader
        avatarUrl={profile.avatarUrl || '/avatar.png'}
        name={profile.fullName}
        phone={profile.phone}
        verified={profile.isVerified}
        editLink="/profile/personal_info"
      />

      <div className="p-4 pb-32">
        <div className="text-[12px] color-[#6b6b6b] mb-2 px-4 font-medium uppercase tracking-wider">จัดการบัญชี</div>
        <div className="bg-white rounded-2xl overflow-hidden border border-[#f2f2f2] mb-6">
        <Link href="#" className="flex items-center p-4 border-b border-[#f2f2f2] hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">bolt</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">จัดการสถานที่ใช้ไฟฟ้า</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="flex items-center p-4 border-b border-[#f2f2f2] hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">list_alt</span></div>
          <div className="flex-1">
            <div className="text-[14px] text-[#2b2b2b]">ติดตามสถานะ</div>
            <div className="text-[11px] text-[#999]">ติดตามสถานะคำขอรับบริการและคำร้องได้ที่นี่</div>
          </div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="flex items-center p-4 border-b border-[#f2f2f2] hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">receipt_long</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">จัดการบิลและใบเสร็จ</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>

        <Link href="#" className="flex items-center p-4 hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">card_giftcard</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">สมาชิก Watt-D Point</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
      </div>

        <div className="text-[12px] color-[#6b6b6b] mb-2 px-4 font-medium uppercase tracking-wider">ความช่วยเหลือ</div>
        <div className="bg-white rounded-2xl overflow-hidden border border-[#f2f2f2] mb-6">
        <Link href="#" className="flex items-center p-4 border-b border-[#f2f2f2] hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">store</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">สาขาและช่องทางให้บริการ</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="flex items-center p-4 border-b border-[#f2f2f2] hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">help_outline</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">คำถามที่พบบ่อย/แนะนำการใช้งาน</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="flex items-center p-4 border-b border-[#f2f2f2] hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">electrical_services</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">แจ้งเหตุไฟฟ้าขัดข้อง</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="flex items-center p-4 border-b border-[#f2f2f2] hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">sms_failed</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">แจ้งปัญหา</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="flex items-center p-4 border-b border-[#f2f2f2] hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">contact_support</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">สอบถาม/แนะนำติชม</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="flex items-center p-4 hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">forum</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">ติดต่อเรา</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
      </div>

        <div className="text-[12px] color-[#6b6b6b] mb-2 px-4 font-medium uppercase tracking-wider">ข้อกำหนดและเงื่อนไข</div>
        <div className="bg-white rounded-2xl overflow-hidden border border-[#f2f2f2] mb-6">
        <Link href="#" className="flex items-center p-4 border-b border-[#f2f2f2] hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">gpp_good</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">นโยบายคุ้มครองข้อมูลส่วนบุคคล</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="flex items-center p-4 hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined">policy</span></div>
          <div className="flex-1 text-[14px] text-[#2b2b2b]">ข้อกำหนดและเงื่อนไข</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
      </div>

        <br/>
        <div className="bg-white rounded-2xl overflow-hidden border border-[#f2f2f2] mb-6">
        <Link href="#" className="flex items-center p-4 hover:bg-[#fcfcfc]">
          <div className="w-8 mr-3 text-[#7b818d] flex justify-center"><span className="material-symbols-outlined text-red-500">logout</span></div>
          <div className="flex-1 text-[14px] text-red-500 font-medium">ออกจากระบบ</div>
          <div className="text-[#ccc] text-[20px]"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
      </div>

        <div className="text-center text-[11px] text-[#888] py-8 leading-relaxed">
        เวอร์ชัน 0.0.0<br/>
        © 2568 การไฟฟ้าส่วนภูมิภาค
      </div>
      </div>
    </div>
  );
}
