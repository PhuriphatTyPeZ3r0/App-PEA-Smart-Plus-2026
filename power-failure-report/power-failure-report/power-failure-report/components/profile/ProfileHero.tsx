import Image from 'next/image';

export default function ProfileHero() {
  return (
    <div className="px-5 mt-5 flex justify-between items-start">
      <div className="flex gap-6">
        <div className="w-20 h-20 relative">
          <div className="w-20 h-20 bg-bg-primary rounded-full shadow-sm flex items-center justify-center overflow-hidden">
             {/* Placeholder for Profile Picture or Initial */}
             <div className="w-12 h-12 relative opacity-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20C4 16 8 13 12 13C16 13 20 16 20 20" />
                </svg>
             </div>
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 p-1 bg-btn-primary-bg rounded-full border border-white flex items-center justify-center">
             <Image src="/asset/profile/add.svg" alt="Add" width={10} height={10} />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1">
          <div className="text-lg font-semibold text-text-primary-900">ศิญาพร ชำนิธาศิริกูล</div>
          <div className="text-sm font-normal text-text-quaternary-500">เบอร์มือถือ: 09*-***-1234</div>
          <div className="px-2 py-1 bg-bg-success-primary rounded-full inline-flex items-center gap-1 w-fit mt-1">
            <div className="w-4 h-4 relative">
              <Image src="/asset/profile/shield-tick.svg" alt="Verified" fill className="object-contain" />
            </div>
            <span className="text-xs font-medium text-success-primary">ยืนยันตัวตนแล้ว</span>
          </div>
        </div>
      </div>
      <div className="w-6 h-6 relative mt-2">
        <Image src="/asset/profile/edit.svg" alt="Edit" fill className="object-contain" />
      </div>
    </div>
  );
}
