import React from 'react';

interface TextInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  helperText?: string;
  error?: boolean;
  className?: string;
  icon?: string;
  maxLength?: number;
}

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  readOnly = false,
  helperText,
  error = false,
  className = '',
  icon,
  maxLength
}: TextInputProps) {
  return (
    <div className={`input-group mb-6 relative ${className}`}>
      {label && (
        <label className="input-label absolute text-xs text-[#666] top-3 left-4 z-10">
          {label}
        </label>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        className={`
          custom-input w-full px-4 py-3 border rounded-xl text-base
          outline-none transition-all duration-200
          ${label ? 'pt-7 pb-2' : ''}
          ${disabled || readOnly ? 'bg-[#f6f6f9] text-[#888]' : 'bg-white'}
          ${error ? 'border-[#d32f2f]' : 'border-[#e8e8e8] focus:border-[#9b2785]'}
          ${readOnly ? 'border-[#e8e8e8] bg-[#f6f6f9]' : ''}
        `}
      />
      
      {icon && (
        <span className="material-symbols-outlined absolute right-4 top-1/2 transform -translate-y-1/2 text-[#666]">
          {icon}
        </span>
      )}
      
      {helperText && (
        <p className={`text-xs mt-1 ${error ? 'text-[#d32f2f]' : 'text-[#666]'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
