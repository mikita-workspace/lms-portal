import { LatLngExpression } from 'leaflet';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getAnalytics } from '@/actions/db/get-analytics';
import Map from '@/components/map';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice, getConvertedPrice } from '@/lib/format';

import { Chart } from './_components/chart';
import { DataCard } from './_components/data-card';
import { columns } from './_components/data-table/columns';
import { DataTable } from './_components/data-table/data-table';

const AnalyticsPage = async () => {
  const user = await getCurrentUser();

  const {
    chart,
    map: mapData,
    totalProfit,
    totalRevenue,
    transactions,
  } = await getAnalytics(user!.userId);

  const mapMarkers = mapData.map((mp) => {
    return {
      position: mp.position,
      content: (
        <div className="flex flex-col text-sm max-w-[150px]">
          <h2 className="text-medium font-semibold">
            {mp.country}, {mp.city}
          </h2>
          <div className="text-xs">
            In this region, <span className="font-semibold">{mp.totalSales} </span>sales have been
            made. The total amount of spending by client is
            <span className="font-semibold">
              {' '}
              {formatPrice(getConvertedPrice(mp.totalAmount), {
                locale: DEFAULT_LOCALE,
                currency: mp.currency ?? DEFAULT_CURRENCY,
              })}
            </span>
            .
          </div>
        </div>
      ),
    };
  }) as { position: LatLngExpression; content: React.ReactNode }[];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-12">Analytic Dashboard</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-xl">Income</p>
          <span className="text-xs text-muted-foreground">Balances are updated every hour</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
          <div className="flex flex-col gap-4 mb-4 md:mb-0">
            <DataCard label="Total Revenue" totalRevenue={totalRevenue} />
            <DataCard label="Total Profit" totalProfit={totalProfit} />
          </div>
          <Map
            className="w-full h-[400px] border rounded-lg col-span-2"
            mapStyles={{ width: '100%', height: '100%', borderRadius: '8px', zIndex: 1 }}
            markers={mapMarkers}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <p className="font-medium text-xl">Sales chart</p>
        <Chart data={chart} />
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-xl">Client Transactions</p>
          <span className="text-xs text-muted-foreground">Transactions are updated every hour</span>
        </div>

        <DataTable columns={columns} data={transactions} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
