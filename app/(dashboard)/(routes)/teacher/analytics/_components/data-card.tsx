import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Currency, Locale } from '@/constants/locale';
import { formatPrice } from '@/lib/format';

type DataCardProps = {
  label: string;
  shouldFormat?: boolean;
  value: number;
};

export const DataCard = ({ label, shouldFormat, value }: DataCardProps) => {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {shouldFormat
            ? formatPrice(value, { locale: Locale.EN_US, currency: Currency.USD })
            : value}
        </div>
      </CardContent>
    </Card>
  );
};
