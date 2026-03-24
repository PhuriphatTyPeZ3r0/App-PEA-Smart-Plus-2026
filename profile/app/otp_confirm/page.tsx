'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';

export default function OtpConfirm() {
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [displayPhone, setDisplayPhone] = useState('+6691*****12');
  const [timer, setTimer] = useState('ขอรหัสใหม่ในอีก 3:00 นาที');
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    // Phone formatting display
    const phone = sessionStorage.getItem('newPhone');
    if (phone && phone.length >= 10 && phone.startsWith('0')) {
      const withoutZero = phone.substring(1);
      const firstTwo = withoutZero.substring(0, 2);
      const lastTwo = withoutZero.substring(withoutZero.length - 2);
      const middleMask = '*'.repeat(withoutZero.length - 4);
      setDisplayPhone(`+66${firstTwo}${middleMask}${lastTwo}`);
    } else if (phone) {
      setDisplayPhone(phone);
    }

    // Focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Countdown timer logic
    let timerId: NodeJS.Timeout;
    if (timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setTimer('ขอรหัสใหม่');
            return 0;
          }
          const minutes = Math.floor(newTime / 60);
          const seconds = newTime % 60;
          setTimer(`ขอรหัสใหม่ในอีก ${minutes}:${seconds < 10 ? '0' + seconds : seconds} นาที`);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = val;

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all filled
    const allFilled = inputRefs.current.slice(0, 6).every(input => input?.value.length === 1);
    if (allFilled) {
      sessionStorage.setItem('updatedPhone', sessionStorage.getItem('newPhone') || '');
      setTimeout(() => {
        router.push('/success_phone');
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '0' }}>
      <div className="form-container" style={{ padding: '20px 24px' }}>
        <Link href="/change_phone" style={{ display: 'inline-block', marginBottom: '35px', color: '#111', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 'bold' }}>chevron_left</span>
        </Link>
        
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
          ยืนยันหมายเลขโทรศัพท์
        </h1>
        <p style={{ fontSize: '14px', color: '#333', marginBottom: '4px', fontWeight: '400' }}>
          กรอกรหัส OTP 6 หลัก ที่ส่งไปยัง <span>{displayPhone}</span>
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
            รหัสอ้างอิง: 16DD8D
          </div>
          <div style={{ fontSize: '14px', color: timeLeft > 0 ? '#db5b94' : '#84328f', fontWeight: '600', cursor: 'pointer' }}>
            {timer}
          </div>
        </div>
      </div>
    </div>
  );
}
