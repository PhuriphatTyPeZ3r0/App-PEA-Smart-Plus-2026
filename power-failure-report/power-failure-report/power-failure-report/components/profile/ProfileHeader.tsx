import Image from 'next/image';

export default function ProfileHeader() {
  return (
    <div className="flex flex-col">
      {/* Header/Status Bar Placeholder */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="w-10 text-center text-text-primary-900 text-base font-sans leading-5">9:41</div>
        <div className="flex gap-1.5 items-center">
           <div className="w-5 h-3 bg-text-primary-900" />
           <div className="w-4 h-3 bg-text-primary-900" />
           <div className="w-6 h-3 opacity-30 rounded border border-text-primary-900" />
           <div className="w-[1.31px] h-1 opacity-40 bg-text-primary-900" />
           <div className="w-5 h-2 bg-text-primary-900 rounded-sm" />
        </div>
      </div>

      {/* Title Header */}
      <div className="flex items-center justify-between px-2 h-12">
        <div className="p-3 rounded-full flex items-center">
          <div className="w-5 h-5 relative overflow-hidden">
             <Image src="/asset/profile/arrow-left.svg" alt="Back" fill className="object-contain" />
          </div>
        </div>
        <div className="flex-1 px-3 py-2.5 flex justify-center items-center">
          <h1 className="text-xl font-medium text-text-primary-900">บัญชีผู้ใช้</h1>
        </div>
        <div className="flex justify-end items-center pr-2">
          <div className="p-2 rounded-[50px] flex items-center gap-1.5">
            <div className="w-6 h-6 relative overflow-hidden">
              <Image src="/asset/profile/edit.svg" alt="Settings" fill className="object-contain" />
            </div>
            <span className="text-base font-medium text-btn-tertiary-fg">ตั้งค่า</span>
          </div>
        </div>
      </div>
    </div>
  );
}
