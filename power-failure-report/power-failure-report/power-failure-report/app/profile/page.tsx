import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileHero from '@/components/profile/ProfileHero';
import MenuListItem from '@/components/profile/MenuListItem';
import BottomNavigation from '@/components/profile/BottomNavigation';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-kanit">
      {/* Background with Gradients */}
      <div className="relative w-full h-[384px] overflow-hidden">
        <div className="absolute inset-0 bg-fuchsia-200 bg-[radial-gradient(ellipse_291.08%_159.18%_at_50.00%_-59.36%,_#CF07AA_0%,_#FFE0F9_33%,_#F9FAFB_100%)]" />
        <div className="absolute w-[144px] h-[384px] left-[312.95px] top-[261.87px] origin-top-left rotate-[-150.55deg] bg-gradient-to-b from-pink-50 to-pink-50/0 blur-sm" />
        <div className="absolute w-[192px] h-[256px] left-[395.22px] top-[-31.60px] origin-top-left rotate-[28.50deg] bg-gradient-to-b from-pink-100 via-white/50 to-fuchsia-50/0 blur-[2.30px]" />
      </div>

      <div className="absolute top-0 w-full flex flex-col">
        <ProfileHeader />
        <ProfileHero />

        {/* List Content */}
        <div className="mt-8 bg-white rounded-t-[32px] pt-8 min-h-[800px]">
          <div className="px-5 flex flex-col gap-8 pb-32">
            
            {/* Manage Account Group */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-normal text-text-quaternary-500">จัดการบัญชี</div>
              <div className="flex flex-col">
                <MenuListItem 
                  icon="/asset/profile/edit-02.svg" 
                  title="จัดการสถานที่ใช้ไฟฟ้า" 
                />
                <MenuListItem 
                  icon="/asset/profile/zap-square.svg" 
                  title="ติดตามสถานะ" 
                  subtitle="ติดตามสถานะคำขอรับบริการและคำร้องได้ที่นี่"
                />
                <MenuListItem 
                  icon="/asset/profile/receipt.svg" 
                  title="จัดการบิลและใบเสร็จ" 
                />
                <MenuListItem 
                  icon="/asset/profile/credit-card-02.svg" 
                  title="จัดการบัตรเครดิต/เดบิต" 
                />
                <MenuListItem 
                  icon="/asset/profile/gift-01.svg" 
                  title="สมาชิก Watt-D Point" 
                />
              </div>
            </div>

            {/* Help Group */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-normal text-text-quaternary-500">ความช่วยเหลือ</div>
              <div className="flex flex-col">
                <MenuListItem icon="/asset/profile/building-02.svg" title="สาขาและช่องทางให้บริการ" />
                <MenuListItem icon="/asset/profile/help-circle.svg" title="คำถามที่พบบ่อย/แนะนำการใช้งาน" />
                <MenuListItem icon="/asset/profile/zap-off.svg" title="แจ้งไฟฟ้าขัดข้อง" />
                <MenuListItem icon="/asset/profile/message-alert-circle.svg" title="แจ้งปัญหา" />
                <MenuListItem icon="/asset/profile/message-chat-circle.svg" title="สอบถาม/แนะนำติชม" />
                <MenuListItem icon="/asset/profile/dotpoints-01.svg" title="ติดต่อเรา" />
              </div>
            </div>

            {/* Legal Group */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-normal text-text-quaternary-500">ข้อกำหนดและเงื่อนไข</div>
              <div className="flex flex-col">
                <MenuListItem icon="/asset/profile/file-shield-02.svg" title="นโยบายคุ้มครองข้อมูลส่วนบุคคล" />
                <MenuListItem icon="/asset/profile/shield-tick.svg" title="ข้อกำหนดและเงื่อนไข" />
              </div>
            </div>

            {/* Logout */}
            <div className="flex flex-col">
               <MenuListItem icon="/asset/profile/log-out-01.svg" title="ออกจากระบบ" hideChevron />
            </div>

            {/* App Info */}
            <div className="flex flex-col items-center gap-1 py-4">
               <div className="text-xs font-normal text-text-tertiary-600">เวอร์ชัน 10.8.0</div>
               <div className="text-xs font-normal text-text-tertiary-600">© 2568 การไฟฟ้าส่วนภูมิภาค</div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
