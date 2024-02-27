'use client';

import { Fee } from '@prisma/client';
import { useEffect, useState } from 'react';

import { useLocaleAmount } from '@/hooks/use-locale-amount';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Skeleton } from '../ui';
import { TextBadge } from './text-badge';

type PriceProps = {
  customRates?: string | null;
  fees?: Fee[];
  price: number | null;
  useDefaultLocale?: boolean;
};

export const Price = ({ customRates, fees = [], price, useDefaultLocale }: PriceProps) => {
  const {
    amount,
    formattedPrice,
    formattedCalculatedFees,
    formattedTotalFees,
    formattedNet,
    isLoading,
  } = useLocaleAmount({
    customRates,
    fees,
    price,
    useDefaultLocale,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="h-[20px] w-[100px]" />;
  }

  return (
    <p className="text-md md:text-small font-bold text-neutral-700 dark:text-neutral-300">
      {isLoading && <Skeleton className="h-[20px] w-[100px]" />}
      {!isLoading && (amount ?? 0) > 0 && (
        <div className="flex flex-col gap-1">
          <span>{formattedPrice}</span>
          {formattedNet && formattedTotalFees && (
            <Accordion type="single" collapsible>
              <AccordionItem value="fees" className="border-none">
                <AccordionTrigger className="pt-0 pb-2 hover:no-underline">
                  <div className="flex gap-1 text-xs font-normal text-muted-foreground">
                    <span>{formattedNet}</span>
                    <span>+&nbsp;{formattedTotalFees}</span>
                    <span className="">Fees</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1 text-xs font-normal text-muted-foreground">
                  {formattedCalculatedFees.map((fee) => (
                    <div key={fee.id} className="flex gap-2 items-center justify-between">
                      <div>
                        {fee.name}&nbsp;(x{fee.quantity})
                      </div>
                      <div>{fee.amount}</div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      )}
      {!isLoading && amount === 0 && <TextBadge variant="lime" label="Free" />}
    </p>
  );
};
