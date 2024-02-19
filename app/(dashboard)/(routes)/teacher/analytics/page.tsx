import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getAnalytics } from '@/actions/db/get-analytics';

import { DataCard } from './_components/data-card';
// import { Chart } from './_components/chart';

const AnalyticsPage = async () => {
  const user = await getCurrentUser();

  const { totalSales, lastPurchases, totalRevenue } = await getAnalytics(user!.userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <DataCard totalRevenue={totalRevenue} />
        <DataCard totalSales={totalSales} />
        <DataCard lastPurchases={lastPurchases} />
      </div>
      {/* <Chart data={data} /> */}
    </div>
  );
};

export default AnalyticsPage;
