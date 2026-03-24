import React from 'react';

interface SectionTitleProps {
  title: string;
  className?: string;
}

export default function SectionTitle({ title, className = '' }: SectionTitleProps) {
  return (
    <div className={`section-title px-5 py-4 font-semibold text-[#333] text-base ${className}`}>
      {title}
    </div>
  );
}
