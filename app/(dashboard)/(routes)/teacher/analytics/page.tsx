import { getAnalytics } from '@/actions/analytics/get-analytics';
import { getCurrentUser } from '@/actions/auth/get-current-user';

import { ClientTransactions } from './_components/client-transactions/client-transactions';
import { Income } from './_components/income/income';
import { SalesChart } from './_components/sales-chart';
import { StripeConnect } from './_components/stripe-connect';

const AnalyticsPage = async () => {
  const user = await getCurrentUser();

  const {
    chart,
    map: mapData,
    stripeConnect,
    stripeConnectPayouts,
    totalProfit,
    totalRevenue,
    transactions,
  } = await getAnalytics(user!.userId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-12">Analytics Dashboard</h1>
      <StripeConnect stripeConnect={stripeConnect} stripeConnectPayout={stripeConnectPayouts} />
      <Income mapData={mapData} totalProfit={totalProfit} totalRevenue={totalRevenue} />
      <SalesChart data={chart} />
      <ClientTransactions transactions={transactions} />
    </div>
  );
};

export default AnalyticsPage;
