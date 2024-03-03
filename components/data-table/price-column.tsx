import { TextBadge } from '@/components/common/text-badge';
import { formatPrice, getConvertedPrice } from '@/lib/format';

type PriceColumnProps = {
  amount: number;
  locale: { locale: string; currency: string };
};

export const PriceColumn = ({ amount, locale }: PriceColumnProps) => {
  const formatted = formatPrice(getConvertedPrice(amount), locale);

  return amount ? <span>{formatted}</span> : <TextBadge variant="lime" label="Free" />;
};
