import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getAnalytics } from '@/actions/db/get-analytics';

import { Chart } from './_components/chart';
import { DataRevenueCard } from './_components/data-revenue-card';
import { DataSalesCard } from './_components/data-sales-card';
import { LastPurchaseCard } from './_components/last-purchase-card';

const AnalyticsPage = async () => {
  const user = await getCurrentUser();

  const { data, totalSales, lastPurchases } = await getAnalytics(user!.userId);

  const prices = data.flatMap((dt) => dt.purchases.map((ps) => ps.price));

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <DataRevenueCard prices={prices} />
        <DataSalesCard sales={totalSales} />
        <LastPurchaseCard purchases={lastPurchases} />
      </div>
      {/* <Chart data={data} /> */}
    </div>
  );
};

export default AnalyticsPage;
