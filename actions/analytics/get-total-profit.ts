'use server';

import { Fee, PayoutRequest } from '@prisma/client';
import groupBy from 'lodash.groupby';

import { CalculationMethod, FeeType } from '@/constants/fees';
import { getCalculatedFee } from '@/lib/fees';

export const getTotalProfit = async (
  stripeBalanceTransactions: Record<string, any>[],
  totalRevenue: number,
  fees: Fee[],
  successfulPayouts: Pick<PayoutRequest, 'amount' | 'currency'>[],
) => {
  const totalFees = stripeBalanceTransactions
    .reduce<ReturnType<typeof getCalculatedFee>[]>((totalFees, current) => {
      const calculatedFees = fees.map((fee) => getCalculatedFee(current.amount, fee));
      const stripeDiff = Math.abs(
        current.fee -
          calculatedFees.reduce(
            (acc, current) => acc + (current.type === FeeType.STRIPE ? current.amount : 0),
            0,
          ),
      );

      const stripeProcessingFee = calculatedFees.find(
        (fee) => fee.method === CalculationMethod.PERCENTAGE && fee.type === FeeType.STRIPE,
      );

      return [
        ...totalFees,
        ...calculatedFees,
        ...(stripeProcessingFee
          ? [
              {
                amount: Math.round(stripeDiff),
                id: stripeProcessingFee.id,
                method: stripeProcessingFee.method,
                name: stripeProcessingFee.name,
                quantity: 1,
                type: stripeProcessingFee.type,
              },
            ]
          : []),
      ];
    }, [])
    .flat();

  const groupedFeesByName = groupBy(totalFees, (item) => item.name);

  const feeDetails = Object.keys(groupedFeesByName).map((key) => ({
    name: key,
    amount: groupedFeesByName[key].reduce((total, current) => total + current.amount, 0),
  }));

  const feeAmount = feeDetails.reduce((amount, current) => amount + current.amount, 0);
  const net = totalRevenue - feeAmount;
  const availableForPayout =
    net - successfulPayouts.reduce((acc, current) => acc + current.amount, 0);

  return {
    availableForPayout,
    fee: feeAmount,
    feeDetails,
    net,
    total: totalRevenue,
  };
};
