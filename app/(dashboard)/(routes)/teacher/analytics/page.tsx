import { getAnalytics } from '@/actions/analytics/get-analytics';
import { getCurrentUser } from '@/actions/auth/get-current-user';

import { ClientTransactions } from './_components/client-transactions';
import { Income } from './_components/income';
import { SalesChart } from './_components/sales-chart';
import { StripeConnect } from './_components/stripe-connect';

const AnalyticsPage = async () => {
  const user = await getCurrentUser();

  const {
    chart,
    map: mapData,
    totalProfit,
    totalRevenue,
    transactions,
  } = await getAnalytics(user!.userId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-12">Analytics Dashboard</h1>
      <StripeConnect />
      <Income mapData={mapData} totalProfit={totalProfit} totalRevenue={totalRevenue} />
      <SalesChart data={chart} />
      <ClientTransactions transactions={transactions} />
    </div>
  );
};

export default AnalyticsPage;
