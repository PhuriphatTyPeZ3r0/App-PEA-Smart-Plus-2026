import React from 'react';
import Link from 'next/link';

interface ProfileHeaderProps {
  avatarUrl: string;
  name: string;
  phone: string;
  verified?: boolean;
  onEdit?: () => void;
  editLink?: string;
  badgeColor?: string;
}

export default function ProfileHeader({
  avatarUrl,
  name,
  phone,
  verified = false,
  onEdit,
  editLink = '/personal_info',
  badgeColor = '#c93b9e'
}: ProfileHeaderProps) {
  // Render edit control as Link when editLink is provided, otherwise as a button

  return (
    <div className="bg-gradient-to-b from-[#faeaff] to-white px-6 pt-12 pb-6 relative overflow-hidden">
      {/* Decorative light gradients if needed would go here */}

      <div className="grid grid-cols-3 items-center mb-10 relative z-10">
        <div></div>
        <div className="text-center text-[18px] font-bold text-[#101828]">บัญชีผู้ใช้</div>
        <Link
  href="/profile/settings"
  className="flex items-center justify-end gap-1 text-[#86198f] hover:opacity-80 transition-opacity"
>
  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
  <span className="font-medium text-[14px]">ตั้งค่า</span>
</Link>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        {/* Avatar */}
        <div className="relative w-[100px] h-[100px] rounded-full bg-white shadow-sm flex-shrink-0 flex items-center justify-center">
          <img src={avatarUrl} alt="Profile" className="w-[88px] h-[88px] rounded-full object-cover" />
          <div
            className="absolute bottom-1 right-1 rounded-full flex items-center justify-center cursor-pointer border-2 border-white"
            style={{ backgroundColor: badgeColor, width: '28px', height: '28px' }}
          >
            <span className="material-symbols-outlined text-white" style={{ fontSize: '15px' }}>
              photo_camera
            </span>
          </div>
        </div>

        {/* Info & Edit link flex container */}
        <div className="flex-1 flex justify-between items-start">
          <div className="flex flex-col justify-center max-w-[calc(100%-30px)]">
            <div className="text-[17px] font-bold text-[#101828] mb-1 leading-tight break-words">{name}</div>
            <div className="text-[13px] text-[#475467] mb-2 leading-tight">เบอร์มือถือ : {phone}</div>
            {verified && (
              <div className="inline-flex items-center gap-[2px] bg-[#ecfdf3] text-[#027a48] px-2.5 py-1 rounded-full text-[12px] font-medium w-fit">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                ยืนยันตัวตนแล้ว
              </div>
            )}
          </div>

          {/* Edit Button */}
          <div className="pt-2">
            {editLink ? (
              <Link href={editLink} className="text-[#98a2b3] hover:text-[#86198f] transition-colors cursor-pointer block">
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>edit</span>
              </Link>
            ) : (
              <button type="button" onClick={onEdit} className="text-[#98a2b3] hover:text-[#86198f] transition-colors cursor-pointer block">
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>edit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
