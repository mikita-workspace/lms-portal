'use server';

type MonthlyRevenueData = {
  totalRevenue: number;
  transactionCount: number;
};

type TotalRevenueData = {
  average: number;
  diff: number | null;
  revenue: number;
  transactionCount: number;
}[];

export const getTotalRevenueData = async (transactions: any[]) => {
  const monthlyData: Record<string, MonthlyRevenueData> = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.created * 1000);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = { totalRevenue: 0, transactionCount: 0 };
    }

    monthlyData[yearMonth].totalRevenue += transaction.net;
    monthlyData[yearMonth].transactionCount += 1;
  });

  let previousRevenue: number | null = null;

  const totalRevenueData: TotalRevenueData = Object.keys(monthlyData).map((month) => {
    const data = monthlyData[month];

    const revenue = data.totalRevenue;
    const transactionCount = data.transactionCount;

    const average = parseFloat((revenue / transactionCount).toFixed(0));
    const diff = previousRevenue
      ? parseFloat((((revenue - previousRevenue) / previousRevenue) * 100).toFixed(2))
      : null;

    previousRevenue = revenue;

    return {
      average,
      diff,
      revenue,
      transactionCount,
    };
  });

  return totalRevenueData;
};
