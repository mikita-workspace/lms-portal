import { DataTable } from '@/components/data-table/data-table';

import { columns } from './_components/columns';

// import { UsersList } from './_components/users-list/users-list';

const PromoPage = async () => {
  // const users = await getUsers();

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium mb-12">Promotion codes</h1>
      <DataTable columns={columns} data={[]} isPromoPage noLabel="No promotion codes" />
    </div>
  );
};

export default PromoPage;
