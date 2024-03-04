import { Fee } from '@prisma/client';

import { DEFAULT_EXCHANGE_RATE } from '@/constants/locale';
import { getCalculatedFee } from '@/lib/fees';

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

  const calculatedFees = fees.map((fee) => getCalculatedFee(price, fee, exchangeRate));
  const calculatedFeesAmount = calculatedFees.reduce((total, fee) => total + fee.amount, 0);

  return {
    net: price - calculatedFeesAmount,
    calculatedFees,
  };
};
