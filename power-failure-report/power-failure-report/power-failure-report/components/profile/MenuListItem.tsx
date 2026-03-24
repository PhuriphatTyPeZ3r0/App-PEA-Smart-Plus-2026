import Image from 'next/image';

interface MenuListItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  hideChevron?: boolean;
}

export default function MenuListItem({ icon, title, subtitle, hideChevron = false }: MenuListItemProps) {
  return (
    <div className="h-auto min-h-[56px] px-2.5 py-4 border-b border-border-secondary flex justify-between items-center gap-4 hover:bg-black/5 cursor-pointer">
      <div className="flex-1 flex items-start gap-4">
        <div className="w-6 h-6 relative flex-shrink-0">
          <Image src={icon} alt={title} fill className="object-contain" />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-1">
          <div className="text-base font-medium text-text-primary-900 leading-6">{title}</div>
          {subtitle && <div className="text-sm font-normal text-text-quaternary-500 leading-5">{subtitle}</div>}
        </div>
      </div>
      {!hideChevron && (
        <div className="w-6 h-6 relative flex-shrink-0">
          <Image src="/asset/profile/arrow-right.svg" alt="Go" fill className="object-contain" />
        </div>
      )}
    </div>
  );
}
