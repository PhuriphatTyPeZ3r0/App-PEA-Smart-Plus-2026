'use client';

import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChange?: (otp: string) => void;
  disabled?: boolean;
}

export default function OTPInput({
  length = 6,
  onComplete,
  onChange,
  disabled = false
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = val;

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Get all values
    const allValues = inputRefs.current.slice(0, length).map(input => input?.value || '').join('');
    onChange?.(allValues);

    // Check if all filled
    if (allValues.length === length) {
      onComplete?.(allValues);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 mb-12">
      {Array.from({ length }).map((_, i) => (
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
          disabled={disabled}
          className="
            w-full h-10 border-b-2 border-[#bbb]
            text-center text-2xl font-bold
            outline-none transition-all
            focus:border-[#9b2785] focus:text-[#9b2785]
            disabled:bg-gray-200 disabled:cursor-not-allowed
          "
        />
      ))}
    </div>
  );
}
