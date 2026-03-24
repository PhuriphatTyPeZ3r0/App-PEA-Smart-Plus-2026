import React from 'react';

interface FormContainerProps {
  title: string;
  description?: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormContainer({
  title,
  description,
  note,
  children,
  className = ''
}: FormContainerProps) {
  return (
    <div className={`form-container px-5 py-0 ${className}`}>
      <h1 className="form-title text-2xl font-bold text-[#1a1a1a] mb-4">
        {title}
      </h1>
      
      {description && (
        <p className="form-desc text-sm text-[#333] font-medium mb-1">
          {description}
        </p>
      )}
      
      {note && (
        <p className="form-note text-xs text-[#666] mb-9">
          {note}
        </p>
      )}

      {children}
    </div>
  );
}
