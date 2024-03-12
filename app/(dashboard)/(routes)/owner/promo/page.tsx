import { getStripePromo } from '@/actions/stripe/get-stripe-promo';
import { DataTable } from '@/components/data-table/data-table';

import { columns } from './_components/columns';

const PromoPage = async () => {
  const { coupons, promos } = await getStripePromo();

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium mb-12">Promotion codes</h1>
      <DataTable
        columns={columns}
        coupons={coupons}
        data={promos}
        isPromoPage
        noLabel="No promotion codes"
      />
    </div>
  );
};

export default PromoPage;
