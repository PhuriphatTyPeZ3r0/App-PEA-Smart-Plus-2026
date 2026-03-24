import React from 'react';
import Link from 'next/link';

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
  onBackClick?: () => void;
  rightContent?: React.ReactNode;
  variant?: 'plain' | 'rounded';
  className?: string;
}

export default function TopBar({
  title,
  showBackButton = false,
  backHref = '/',
  onBackClick,
  rightContent,
  variant = 'plain',
  className = ''
}: TopBarProps) {
  // Render back control as Link when backHref provided and no onBackClick, otherwise as a button

  const bgClass = variant === 'rounded' ? 'rounded-b-3xl' : '';

  return (
    <div
      className={`
        top-bar-plain w-full px-5 py-5 bg-white
        flex items-center justify-between relative
        ${variant === 'rounded' ? 'rounded-b-3xl' : ''}
        ${className}
      `}
    >
      {showBackButton && (
        backHref && !onBackClick ? (
          <Link href={backHref} className="absolute left-5 flex items-center cursor-pointer text-[#333] hover:text-[#9b2785] transition-colors">
            <span className="material-symbols-outlined font-bold text-2xl">chevron_left</span>
          </Link>
        ) : (
          <button type="button" onClick={onBackClick} className="absolute left-5 flex items-center cursor-pointer text-[#333] hover:text-[#9b2785] transition-colors">
            <span className="material-symbols-outlined font-bold text-2xl">chevron_left</span>
          </button>
        )
      )}

      <div className={`page-title text-lg font-bold text-[#333] ${showBackButton ? 'flex-1 text-center' : ''}`}>
        {title}
      </div>

      {rightContent && (
        <div className="absolute right-5">
          {rightContent}
        </div>
      )}
    </div>
  );
}
