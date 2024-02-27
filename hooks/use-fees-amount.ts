import { Fee } from '@prisma/client';

import { CalculationMethod } from '@/constants/fees';

export const useFeesAmount = (price: number | null, fees: Fee[]) => {
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
      amount = fee.amount;
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
