'use client';

import { Course, Price } from '@prisma/client';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { locales } from '@/constants/locale';
import { fetcher } from '@/lib/fetcher';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

import { CurrencyInput } from '../currency-input';

type PriceFormProps = {
  courseId: string;
  initialData: Course & { price: Price | null };
};

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const router = useRouter();

  const [prices, setPrices] = useState<Record<string, string | number>>({
    byn: initialData.price?.byn || '',
    eur: initialData.price?.eur || '',
    usd: initialData.price?.usd || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPricesEmpty = Object.values(prices).every((price) => !price);

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

  const handleOnPriceChange = (_price?: string, _name: string = '') => {
    setPrices({ ...prices, [_name]: _price ?? '' });
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    const price = Object.fromEntries(
      Object.entries(prices).map(([key, value]) => [
        key,
        typeof value === 'string' ? Number(value.replace(/,/g, '.')) : value,
      ]),
    );

    try {
      await fetcher.patch(`/api/courses/${courseId}`, { body: { price } });

      toast.success('Course updated');
      handleToggleEdit();

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border  bg-neutral-100 dark:bg-neutral-900 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Price
        <Button onClick={handleToggleEdit} variant="outline" size="sm">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && initialData.price && (
        <p className={cn('text-sm mt-2', !initialData.price && 'text-neutral-500 italic')}>
          {locales
            .map((locale) => {
              const currency = locale.currency.toLowerCase() as keyof Price;

              return formatPrice(
                initialData.price ? (initialData.price[currency] as number) : 0,
                locale,
              );
            })
            .join(' / ')}
        </p>
      )}
      {isEditing && (
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          {locales.map((locale) => (
            <CurrencyInput
              key={`${locale.currency}-${locale.locale}`}
              intlConfig={locale}
              name={locale.currency.toLowerCase()}
              onValueChange={handleOnPriceChange}
              placeholder={`Set a price for ${locale.locale} region`}
              value={prices[locale.currency.toLowerCase()]}
            />
          ))}
          <div className="flex items-center gap-x-2">
            <Button disabled={isSubmitting || isPricesEmpty} isLoading={isSubmitting} type="submit">
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
