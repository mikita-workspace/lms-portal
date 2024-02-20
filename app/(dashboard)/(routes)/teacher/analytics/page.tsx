import { LatLngExpression } from 'leaflet';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getAnalytics } from '@/actions/db/get-analytics';
import Map from '@/components/map';
import { locales } from '@/constants/locale';
import { formatPrice } from '@/lib/format';

import { Chart } from './_components/chart';
import { DataCard } from './_components/data-card';

const AnalyticsPage = async () => {
  const user = await getCurrentUser();

  const { lastPurchases, topSales, totalRevenue, totalSales, data } = await getAnalytics(
    user!.userId,
  );

  const mapMarkers = topSales.map((sale) => {
    const [country, city] = sale.key.split('-');
    const locale = locales.find((lc) => lc.currency === sale.currency);

    return {
      position: sale.position,
      content: (
        <div className="flex flex-col text-sm">
          <h2 className="text-medium font-semibold gap-2">
            {country}, {city}
          </h2>
          <span>{formatPrice(sale.totalPrice, locale!)}</span>
        </div>
      ),
    };
  }) as { position: LatLngExpression; content: React.ReactNode }[];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <DataCard label="Total Revenue" totalRevenue={totalRevenue} />
        <DataCard label="Total Sales" totalSales={totalSales} topSales={topSales} />
        <DataCard label="Purchases" lastPurchases={lastPurchases} />
      </div>
      <Map
        className="w-full h-[400px] border rounded-lg mb-6"
        mapStyles={{ width: '100%', height: '100%', borderRadius: '8px', zIndex: 1 }}
        markers={mapMarkers}
      />
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
