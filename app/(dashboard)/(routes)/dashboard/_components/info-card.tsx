import { LucideIcon } from 'lucide-react';

import { IconBadge } from '@/components/common/icon-badge';

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: 'default' | 'success';
};

export const InfoCard = ({ icon, label, numberOfItems, variant }: InfoCardProps) => {
  return (
    <div className="border rounded-lg flex items-center gap-x-2 p-3">
      <IconBadge icon={icon} variant={variant} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-secondary-foreground text-sm">
          {numberOfItems} {numberOfItems > 1 ? 'Courses' : 'Course'}
        </p>
      </div>
    </div>
  );
};
