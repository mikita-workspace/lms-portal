import { getAnalytics } from '@/actions/analytics/get-analytics';
import { getCurrentUser } from '@/actions/auth/get-current-user';
import { Banner } from '@/components/common/banner';
import { ErrorModal } from '@/components/modals/error-modal';
import { DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice, getConvertedPrice } from '@/lib/format';

import { ClientTransactions } from './_components/client-transactions/client-transactions';
import { Income } from './_components/income/income';
import { SalesChart } from './_components/sales-chart';
import { StripeConnect } from './_components/stripe-connect/stripe-connect';

const AnalyticsPage = async () => {
  const user = await getCurrentUser();

  const {
    activePayouts,
    chart,
    isError,
    map: mapData,
    stripeConnect,
    stripeConnectPayouts,
    totalProfit,
    totalRevenue,
    transactions,
  } = await getAnalytics(user!.userId);

  const hasActivePayouts = Boolean(activePayouts?.length);

  return (
    <>
      {isError && <ErrorModal />}
      {hasActivePayouts && (
        <Banner
          label={`You have a pending payment request for ${formatPrice(
            getConvertedPrice(activePayouts[0].amount),
            {
              locale: DEFAULT_LOCALE,
              currency: activePayouts[0].currency,
            },
          )}. A new request will be available after the current one is completed.`}
          variant="warning"
        />
      )}
      <div className="p-6">
        <h1 className="text-2xl font-medium mb-12">Analytics Dashboard</h1>
        <StripeConnect
          hasActivePayouts={hasActivePayouts}
          stripeConnect={stripeConnect}
          stripeConnectPayout={stripeConnectPayouts}
          totalProfit={totalProfit}
        />
        <Income mapData={mapData} totalProfit={totalProfit} totalRevenue={totalRevenue} />
        <SalesChart data={chart} />
        <ClientTransactions transactions={transactions} />
      </div>
    </>
  );
};

export default AnalyticsPage;
