'use client';

import { Course } from '@prisma/client';
import { format, fromUnixTime } from 'date-fns';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { TextBadge } from '@/components/common/text-badge';
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/constants/locale';
import { useLocaleStore } from '@/hooks/use-locale-store';
import { fetcher } from '@/lib/fetcher';
import { formatPrice, getConvertedPrice, getScaledPrice } from '@/lib/format';
import { hasJsonStructure } from '@/lib/utils';

import { CurrencyInput } from '../currency-input';

type PriceFormProps = {
  courseId: string;
  initialData: Course;
};

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const { exchangeRates, localeInfo } = useLocaleStore((state) => ({
    exchangeRates: state.exchangeRates,
    localeInfo: state.localeInfo,
  }));
  const router = useRouter();

  const [price, setPrice] = useState<string | number>(
    getConvertedPrice(initialData?.price ?? 0) || '',
  );
  const [selectedCurrency, setSelectedCurrency] = useState(
    localeInfo?.locale.currency ?? DEFAULT_CURRENCY,
  );
  const [customRates, setCustomRates] = useState(initialData.customRates ?? '');
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

  const handleCustomRatesChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setCustomRates('');
      return;
    }

    setCustomRates(event.target.value);
  };

  const handleCurrencySelect = (_currency: string) => {
    setSelectedCurrency(_currency);
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      await fetcher.patch(`/api/courses/${courseId}`, {
        body: {
          customRates,
          price: getScaledPrice(
            typeof price === 'string' ? Number(price.replace(/,/g, '.')) : price,
          ),
        },
      });

      toast.success('Course updated');
      handleToggleEdit();

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidCustomRates = hasJsonStructure(customRates);

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
        (Number(price) ? (
          <p className="text-sm mt-2">
            {formatPrice(price as number, { locale: DEFAULT_LOCALE, currency: DEFAULT_CURRENCY })}
          </p>
        ) : (
          <TextBadge variant="lime" label="Free" />
        ))}
      {isEditing && (
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 justify-center">
            <CurrencyInput
              intlConfig={{ locale: DEFAULT_LOCALE, currency: DEFAULT_CURRENCY }}
              name="price"
              onValueChange={handleOnPriceChange}
              placeholder={`Set a price for course`}
              value={price}
            />
            {exchangeRates?.rates && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>≈</span>
                <div>
                  {formatPrice(
                    ((price || 0) as number) *
                      {
                        ...exchangeRates.rates,
                        ...(isValidCustomRates && JSON.parse(customRates)),
                      }[selectedCurrency],
                    {
                      locale: DEFAULT_LOCALE,
                      currency: selectedCurrency,
                    },
                  )}
                </div>
                <Select onValueChange={handleCurrencySelect} defaultValue={selectedCurrency}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="z-10">
                      {Object.keys(exchangeRates.rates).map((key, index) => (
                        <SelectItem key={index} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            {exchangeRates?.updatedAt && (
              <span className="text-xs text-muted-foreground">
                Updated at {format(fromUnixTime(exchangeRates.updatedAt), 'HH:mm, dd MMM yyyy')}
              </span>
            )}
          </div>
          <p className="text-sm">You can also add a custom exchange rate</p>
          <Input
            disabled={isSubmitting}
            placeholder={`e.g. '{"BTN": 82.908948, ... }'`}
            onChange={handleCustomRatesChange}
            defaultValue={initialData?.customRates ?? ''}
          />
          <div className="flex items-center gap-x-2">
            <Button
              disabled={!price || isSubmitting || Boolean(!isValidCustomRates && customRates)}
              isLoading={isSubmitting}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
