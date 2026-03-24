'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PersonalInfo() {
  const [personalPhone, setPersonalPhone] = useState('0910243212');
  const [personalEmail, setPersonalEmail] = useState('charukitsp@gmail.com');

  useEffect(() => {
    const updatedPhone = sessionStorage.getItem('updatedPhone');
    if (updatedPhone) {
      setPersonalPhone(updatedPhone);
    }
    const updatedEmail = sessionStorage.getItem('updatedEmail');
    if (updatedEmail) {
      setPersonalEmail(updatedEmail);
    }
  }, []);

  return (
    <div className="app-container page-info">
      <div className="top-bar-plain">
        <Link href="/" className="back-btn"><span className="material-symbols-outlined">chevron_left</span></Link>
        <div className="page-title">personal_info</div>
      </div>

      <div className="toggle-section">
        <div className="toggle-label">แสดงข้อมูลทั้งหมด</div>
        <div className="toggle-switch"></div>
      </div>

      <div className="info-card">
        <div className="info-header">
          <div className="info-title">ข้อมูลส่วนตัว</div>
          <span className="material-symbols-outlined edit-icon">edit</span>
        </div>
        <div className="info-row">
          <div className="info-label">คำนำหน้า</div>
          <div className="info-value">นาย</div>
        </div>
        <div className="info-row">
          <div className="info-label">ชื่อ</div>
          <div className="info-value">ปฏิพัทธ์</div>
        </div>
        <div className="info-row">
          <div className="info-label">นามสกุล</div>
          <div className="info-value">ชูนุ่น</div>
        </div>
        <div className="info-row">
          <div className="info-label">citizen_no</div>
          <div className="info-value">1819900528841</div>
        </div>
        <div className="info-row">
          <div className="info-label">วัน/เดือน/ปีเกิด</div>
          <div className="info-value">05/11/2548</div>
        </div>
      </div>

      <div className="info-card">
        <div className="info-header">
          <div className="info-title">ข้อมูลพื้นฐาน</div>
          <Link href="/edit_basic_info"><span className="material-symbols-outlined edit-icon">edit</span></Link>
        </div>
        <div className="info-row">
          <div className="info-label"><span className="material-symbols-outlined">phone_iphone</span> เบอร์โทรศัพท์</div>
          <div className="info-value">{personalPhone}</div>
        </div>
        <div className="info-row">
          <div className="info-label"><span className="material-symbols-outlined">mail</span> อีเมล</div>
          <div className="info-value">{personalEmail}</div>
        </div>
      </div>

      <div className="info-card">
        <div className="info-header">
          <div className="info-title">ที่อยู่</div>
          <span className="material-symbols-outlined edit-icon">edit</span>
        </div>
        <div className="info-row">
          <div className="info-label">citizen_card_address</div>
          <div className="info-value">บ้านเลขที่ 95 ถ.มหาราช ต.ปากน้ำ อ.เมืองกระบี่ จ.กระบี่ 81000</div>
        </div>
        <div className="info-row">
          <div className="info-label">ที่อยู่ปัจจุบัน</div>
          <div className="info-value">บ้านเลขที่ 95 ถ.มหาราช ต.ปากน้ำ อ.เมืองกระบี่ จ.กระบี่ 81000</div>
        </div>
      </div>

    </div>
  );
}
