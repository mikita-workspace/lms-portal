import { Fee } from '@prisma/client';

import { CalculationMethod } from '@/constants/fees';
import { DEFAULT_EXCHANGE_RATE } from '@/constants/locale';

type UseFeesAmount = {
  exchangeRate?: number;
  fees: Fee[];
  price: number | null;
};

export const useFeesAmount = ({
  exchangeRate = DEFAULT_EXCHANGE_RATE,
  fees = [],
  price,
}: UseFeesAmount) => {
  if (!price) {
    return {
      net: 0,
      calculatedFees: [],
      quantity: 0,
    };
  }

  const calculatedFees = fees.map((fee) => {
    let amount = 0;

    if (fee.method === CalculationMethod.FIXED) {
      amount = fee.amount * exchangeRate;
    }

    if (fee.method === CalculationMethod.PERCENTAGE) {
      amount = (price * fee.rate) / 100;
    }

    return {
      amount: Math.round(amount),
      id: fee.id,
      name: fee.name,
      quantity: 1,
    };
  });

  return {
    net: price - calculatedFees.reduce((total, fee) => total + fee.amount, 0),
    calculatedFees,
  };
};
