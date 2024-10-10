import { getStripePromo } from '@/actions/stripe/get-stripe-promo';
import { DataTable } from '@/components/data-table/data-table';

import { columns } from './_components/columns';

type PromoPageProps = {
  searchParams: { pageIndex: string; pageSize: string; search?: string };
};

const PromoPage = async ({ searchParams }: PromoPageProps) => {
  const { coupons, customers, pageCount, promos } = await getStripePromo(searchParams);

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium mb-12">Promotion codes</h1>
      <DataTable
        columns={columns}
        coupons={coupons}
        customers={customers}
        data={promos}
        isPromoPage
        noLabel="No promotion codes"
        pageCount={pageCount}
      />
    </div>
  );
};

export default PromoPage;
