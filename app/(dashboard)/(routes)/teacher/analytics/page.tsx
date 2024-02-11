import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getAnalytics } from '@/actions/db/get-analytics';

import { Chart } from './_components/chart';
import { DataCard } from './_components/data-card';

const AnalyticsPage = async () => {
  const user = await getCurrentUser();

  const { data, totalRevenue, totalSales } = await getAnalytics(user!.userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
