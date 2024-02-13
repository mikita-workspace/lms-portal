'use client';

import { Course } from '@prisma/client';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import toast from 'react-hot-toast';

import { TextBadge } from '@/components/common/text-badge';
import { Button } from '@/components/ui/button';
import { Currency, Locale } from '@/constants/locale';
import { fetcher } from '@/lib/fetcher';
import { formatPrice, getCurrencySymbol } from '@/lib/format';
import { cn } from '@/lib/utils';

type PriceFormProps = {
  courseId: string;
  initialData: Course;
};

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const router = useRouter();

  const [price, setPrice] = useState<string | number>(initialData.price || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

  const handleOnPriceChange = (_price?: string) => {
    if (!_price) {
      setPrice('');
      return;
    }

    setPrice(_price);
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      await fetcher.patch(`/api/courses/${courseId}`, { body: { price: Number(price) } });

      toast.success('Course updated');
      handleToggleEdit();

      router.refresh();
    } catch (error) {
      console.log(error);
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
      {!isEditing &&
        (initialData.price ? (
          <p className={cn('text-sm mt-2', !initialData.price && 'text-neutral-500 italic')}>
            {formatPrice(initialData.price, { currency: Currency.USD, locale: Locale.EN_US })}
          </p>
        ) : (
          <TextBadge variant="lime" label="Free" />
        ))}
      {isEditing && (
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <CurrencyInput
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            intlConfig={{ locale: Locale.EN_US, currency: Currency.USD }}
            name="price"
            onValueChange={handleOnPriceChange}
            placeholder="Set a price for your course"
            prefix={getCurrencySymbol(Locale.EN_US, Currency.USD)}
            step={0.01}
            value={price}
          />
          <div className="flex items-center gap-x-2">
            <Button disabled={!price || isSubmitting} isLoading={isSubmitting} type="submit">
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
