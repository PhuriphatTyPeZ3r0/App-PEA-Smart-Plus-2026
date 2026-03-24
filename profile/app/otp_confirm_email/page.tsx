"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';

export default function OtpConfirmEmail() {
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [displayEmail, setDisplayEmail] = useState('c********p@gmail.com');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    const email = sessionStorage.getItem('newEmail');
    if (email) {
      const parts = email.split('@');
      if (parts.length === 2) {
        const username = parts[0];
        const domain = parts[1];
        let maskedUser = username;
        if (username.length > 2) {
          maskedUser = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
        }
        setDisplayEmail(`${maskedUser}@${domain}`);
      } else {
        setDisplayEmail(email);
      }
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = val;

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const allFilled = inputRefs.current.slice(0, 6).every(input => input && input.value.length === 1);
    if (allFilled) {
      const newEmail = sessionStorage.getItem('newEmail');
      if (newEmail) {
        sessionStorage.setItem('updatedEmail', newEmail);
      }
      setTimeout(() => {
        router.push('/success_email');
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  return (
    <div className="app-container" style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '0' }}>
      <div className="top-bar-plain" style={{ justifyContent: 'flex-start', paddingLeft: '20px' }}>
        <Link href="/change_email" className="back-btn" style={{ marginRight: '15px' }}>
          <span className="material-symbols-outlined" style={{ fontWeight: 'bold' }}>chevron_left</span>
        </Link>
      </div>

      <div className="form-container" style={{ padding: '20px 24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
          ยืนยันหมายเลขโทรศัพท์
        </h1>
        <p style={{ fontSize: '14px', color: '#333', marginBottom: '4px', fontWeight: '400' }}>
          กรอกรหัส OTP 6 หลัก ที่ส่งไปยัง
        </p>
        <p style={{ fontSize: '14px', color: '#333', marginBottom: '4px', fontWeight: '400' }}>
          {displayEmail}
        </p>
        <p style={{ fontSize: '14px', color: '#333', marginBottom: '60px', fontWeight: '400' }}>
          หากยังไม่ได้รับ กดขอรหัสใหม่ได้เมื่อครบกำหนดเวลา
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px', gap: '8px' }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input 
              key={i}
              ref={(el: HTMLInputElement | null) => {
                 inputRefs.current[i] = el;
              }}
              type="text" 
              maxLength={1}
              inputMode="numeric"
              onChange={(e) => handleInput(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={{
                width: '100%',
                height: '40px',
                border: 'none',
                borderBottom: '1.5px solid #bbb',
                textAlign: 'center',
                fontSize: '22px',
                outline: 'none',
                backgroundColor: 'transparent',
                borderRadius: '0'
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', color: '#333', fontWeight: '400' }}>
            รหัสอ้างอิง: 3754E9
          </div>
          <div 
            style={{ 
              fontSize: '14px', 
              color: timeLeft > 0 ? '#db5b94' : '#84328f', 
              fontWeight: '600', 
              cursor: timeLeft > 0 ? 'default' : 'pointer' 
            }}
            onClick={() => {
              if (timeLeft === 0) setTimeLeft(180);
            }}
          >
            {timeLeft > 0 ? `ขอรหัสใหม่ในอีก ${timeString} นาที` : 'ขอรหัสใหม่'}
          </div>
        </div>
      </div>
    </div>
  );
}
