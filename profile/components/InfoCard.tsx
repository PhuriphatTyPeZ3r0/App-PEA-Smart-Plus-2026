import React from 'react';
import Link from 'next/link';

interface InfoRowProps {
  label: string;
  value: string;
  icon?: string;
}

interface InfoCardProps {
  title: string;
  rows: InfoRowProps[];
  onEdit?: () => void;
  editLink?: string;
  className?: string;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="info-row border-b border-[#f0f0f0] py-3 last:border-b-0">
      <div className="info-label text-sm text-[#666] flex items-center gap-2">
        {icon && <span className="material-symbols-outlined text-base">{icon}</span>}
        {label}
      </div>
      <div className="info-value text-sm text-[#333] font-medium mt-1">{value}</div>
    </div>
  );
}

export default function InfoCard({
  title,
  rows,
  onEdit,
  editLink,
  className = ''
}: InfoCardProps) {
  const EditElement = editLink ? Link : 'span';
  const editProps = editLink ? { href: editLink } : {};

  return (
    <div className={`info-card bg-white border border-[#f0f0f0] rounded-xl p-4 mb-4 ${className}`}>
      <div className="info-header flex justify-between items-center mb-3">
        <div className="info-title font-semibold text-[#333]">{title}</div>
              {(onEdit || editLink) && (
                editLink ? (
                  <Link href={editLink} className="cursor-pointer hover:text-[#9b2785] transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      edit
                    </span>
                  </Link>
                ) : (
                  <button onClick={onEdit} type="button" className="cursor-pointer hover:text-[#9b2785] transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      edit
                    </span>
                  </button>
                )
              )}
      </div>
      
      <div>
        {rows.map((row, index) => (
          <InfoRow
            key={index}
            label={row.label}
            value={row.value}
            icon={row.icon}
          />
        ))}
      </div>
    </div>
  );
}
