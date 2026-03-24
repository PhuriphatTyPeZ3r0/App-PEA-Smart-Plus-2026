"use client";

import Link from 'next/link';
import ProfileHeader from '../components/ProfileHeader';
import { useUserProfile } from '../components/providers/UserProfileProvider'; // หมายเหตุ: คุณต้องสร้าง/คัดลอก Provider นี้มาไว้ในโปรเจกต์ 'edit profile'

export default function AccountPage() {
  // สมมติว่ามี UserProfileProvider ห่อหุ้มหน้านี้อยู่ใน layout file
  const { profile } = useUserProfile();

  return (
    <div className="app-container page-account bg-white">
      <ProfileHeader
        avatarUrl={profile.avatarUrl || '/avatar.png'}
        name={profile.fullName}
        phone={profile.phone}
        verified={profile.isVerified}
        editLink="/personal_info"
      />

      <div className="p-4">
        <div className="section-title">จัดการบัญชี</div>
        <div className="menu-list">
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">bolt</span></div>
          <div className="menu-content"><div className="menu-label">จัดการสถานที่ใช้ไฟฟ้า</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">list_alt</span></div>
          <div className="menu-content">
            <div className="menu-label">ติดตามสถานะ</div>
            <div className="menu-sublabel">ติดตามสถานะคำขอรับบริการและคำร้องได้ที่นี่</div>
          </div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">receipt_long</span></div>
          <div className="menu-content"><div className="menu-label">จัดการบิลและใบเสร็จ</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>

        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">card_giftcard</span></div>
          <div className="menu-content"><div className="menu-label">สมาชิก Watt-D Point</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
      </div>

        <div className="section-title">ความช่วยเหลือ</div>
        <div className="menu-list">
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">store</span></div>
          <div className="menu-content"><div className="menu-label">สาขาและช่องทางให้บริการ</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">help_outline</span></div>
          <div className="menu-content"><div className="menu-label">คำถามที่พบบ่อย/แนะนำการใช้งาน</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">electrical_services</span></div>
          <div className="menu-content"><div className="menu-label">แจ้งเหตุไฟฟ้าขัดข้อง</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">sms_failed</span></div>
          <div className="menu-content"><div className="menu-label">แจ้งปัญหา</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">contact_support</span></div>
          <div className="menu-content"><div className="menu-label">สอบถาม/แนะนำติชม</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">forum</span></div>
          <div className="menu-content"><div className="menu-label">ติดต่อเรา</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
      </div>

        <div className="section-title">ข้อกำหนดและเงื่อนไข</div>
        <div className="menu-list">
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">gpp_good</span></div>
          <div className="menu-content"><div className="menu-label">นโยบายคุ้มครองข้อมูลส่วนบุคคล</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">policy</span></div>
          <div className="menu-content"><div className="menu-label">ข้อกำหนดและเงื่อนไข</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
      </div>

        <br/>
        <div className="menu-list">
        <Link href="#" className="menu-item">
          <div className="menu-icon"><span className="material-symbols-outlined">logout</span></div>
          <div className="menu-content"><div className="menu-label">ออกจากระบบ</div></div>
          <div className="menu-arrow"><span className="material-symbols-outlined">chevron_right</span></div>
        </Link>
      </div>

        <div className="footer-text">
        เวอร์ชัน 0.0.0<br/>
        © 2568 การไฟฟ้าส่วนภูมิภาค
      </div>
      </div>

      <div className="bottom-nav">
        <Link href="#" className="nav-item">
          <img src="/images/nav-bar.svg" alt="Home" width="24" height="24" />
          หน้าหลัก
        </Link>
        <Link href="#" className="nav-item">
          <img src="/images/nav-bar2.svg" alt="Property" width="24" height="24" />
          สถานที่ใช้ไฟ
        </Link>
        <Link href="#" className="nav-item">
          <img src="/images/nav-bar3.svg" alt="Services" width="24" height="24" />
          บริการ
        </Link>
        <Link href="#" className="nav-item">
          <img src="/images/nav-bar4.svg" alt="Points" width="24" height="24" />
          พอยต์
        </Link>
        <Link href="/" className="nav-item active">
          <img src="/images/user-avatar-1.svg" alt="Profile" width="24" height="24" />
          โปรไฟล์
        </Link>
      </div>
    </div>
  );
}
