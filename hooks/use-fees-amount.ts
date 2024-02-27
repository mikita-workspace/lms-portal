import { Fee } from '@prisma/client';

import { CalculationMethod } from '@/constants/fees';
import { DEFAULT_CURRENCY_RATE } from '@/constants/locale';

type UseFeesAmount = {
  fees: Fee[];
  price: number | null;
  rate?: number;
};

export const useFeesAmount = ({
  fees = [],
  price,
  rate = DEFAULT_CURRENCY_RATE,
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
      amount = fee.amount * rate;
    }

    if (fee.method === CalculationMethod.PERCENTAGE) {
      amount = (price * fee.rate) / 100;
    }

    return {
      amount,
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
