import { Fee } from '@prisma/client';

import { CalculationMethod } from '@/constants/fees';
import { DEFAULT_EXCHANGE_RATE } from '@/constants/locale';

export const getCalculatedFee = (price: number, fee: Fee, exchangeRate = DEFAULT_EXCHANGE_RATE) => {
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
    method: fee.method,
    name: fee.name,
    quantity: 1,
    type: fee.type,
  };
};
