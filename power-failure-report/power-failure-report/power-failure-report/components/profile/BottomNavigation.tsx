import Image from 'next/image';

interface BottomNavItemProps {
  label: string;
  icon: string;
  active?: boolean;
}

function BottomNavItem({ label, icon, active = false }: BottomNavItemProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-[10px] cursor-pointer">
      <div className={`w-6 h-6 relative ${active ? 'text-btn-tertiary-fg' : 'text-nav-icon-fg'}`}>
         <div className={`w-full h-full relative ${active ? 'filter sepia-[1] saturate-[10] hue-rotate-[280deg]' : 'opacity-60'}`}>
            <Image src={icon} alt={label} fill className="object-contain" />
         </div>
      </div>
      <div className={`text-xs ${active ? 'text-fuchsia-800 font-bold' : 'text-slate-600 font-normal'}`}>
        {label}
      </div>
    </div>
  );
}

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-secondary px-5 py-2.5 flex justify-between items-start z-50">
      <BottomNavItem label="หน้าหลัก" icon="/asset/profile/building-02.svg" />
      <BottomNavItem label="สถานที่ใช้ไฟ" icon="/asset/profile/edit-02.svg" />
      <BottomNavItem label="บริการ" icon="/asset/profile/zap-square.svg" />
      <BottomNavItem label="พอยต์" icon="/asset/profile/gift-01.svg" />
      <BottomNavItem label="โปรไฟล์" icon="/asset/profile/shield-tick.svg" active />
    </div>
  );
}
