"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function EditBasicInfo() {
  const [phone, setPhone] = useState('0910243212');
  const [email, setEmail] = useState('charukitsp@gmail.com');

  useEffect(() => {
    const updatedPhone = sessionStorage.getItem('updatedPhone');
    if (updatedPhone) {
      setPhone(updatedPhone);
    }
    const updatedEmail = sessionStorage.getItem('updatedEmail');
    if (updatedEmail) {
      setEmail(updatedEmail);
    }
  }, []);

  return (
    <div className="app-container" style={{ backgroundColor: '#fff' }}>
      <div className="top-bar-plain border-b">
        <Link href="/personal_info" className="back-btn"><span className="material-symbols-outlined">chevron_left</span></Link>
        <div className="page-title" style={{ fontSize: '18px', fontWeight: '600' }}>แก้ไขข้อมูลพื้นฐาน</div>
      </div>

      <div className="edit-menu-list">
        <Link href="/change_phone" className="edit-menu-item">
          <div className="edit-menu-content">
            <div className="edit-menu-title">เปลี่ยนเบอร์โทรศัพท์มือถือ</div>
            <div className="edit-menu-subtitle">{phone}</div>
          </div>
          <span className="material-symbols-outlined chevron">chevron_right</span>
        </Link>
        
        <Link href="/change_email" className="edit-menu-item">
          <div className="edit-menu-content">
            <div className="edit-menu-title">เปลี่ยนอีเมล</div>
            <div className="edit-menu-subtitle">{email}</div>
          </div>
          <span className="material-symbols-outlined chevron">chevron_right</span>
        </Link>
      </div>
    </div>
  );
}

