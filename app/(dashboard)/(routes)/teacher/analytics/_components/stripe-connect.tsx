'use client';

import { ExternalLink, Eye, EyeOff } from 'lucide-react';
import { HandCoins } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button, Card, CardContent } from '@/components/ui';
import { DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice } from '@/lib/format';

export const StripeConnect = () => {
  const [showBalance, setShowBalance] = useState(false);

  const handleShowBalance = () => setShowBalance((prev) => !prev);

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-xl">Connect</p>
        <p className="text-xs text-muted-foreground">
          Your balance in the <span className="text-blue-500 font-semibold">Stripe Connect</span>
        </p>
      </div>
      <Card className="shadow-none">
        <CardContent>
          <div className="pt-6 flex flex-col md:flex-row gap-4 items-center md:justify-between">
            <div className="flex gap-4 items-center">
              <button onClick={handleShowBalance}>
                {showBalance && <Eye className="h-4 w-4" />}
                {!showBalance && <EyeOff className="h-4 w-4" />}
              </button>
              <div className="text-2xl font-bold">
                {showBalance && (
                  <span>{formatPrice(0, { locale: DEFAULT_LOCALE, currency: 'usd' })}</span>
                )}
                {!showBalance && (
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="rounded-full w-[10px] h-[10px] bg-primary text-2xl"
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-2 items-center w-full md:w-auto">
              <Button className="w-full">Create Stripe Connect</Button>
              <Link className="w-full" href={'#'} target="_blank">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span>Stripe Connect</span>
                </Button>
              </Link>
              <Button className="w-full">
                <HandCoins className="h-4 w-4 mr-2" />
                <span>Request a payout</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
