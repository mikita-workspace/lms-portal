'use client';

import { useTranslations } from 'next-intl';

import { getUserBilling } from '@/actions/stripe/get-user-billing';
import { DataTable } from '@/components/data-table/data-table';

import { columns } from './data-table/columns';

type BillingHistoryProps = {
  userBilling: Awaited<ReturnType<typeof getUserBilling>>;
};

export const BillingHistory = ({ userBilling }: BillingHistoryProps) => {
  const t = useTranslations('settings.billing');

  return (
    <div className="flex flex-col gap-4 mt-8">
      <p className="font-medium text-xl">{t('history')}</p>
      <DataTable
        columns={columns}
        data={userBilling}
        isServerSidePagination={false}
        noLabel={t('noInvoices')}
      />
    </div>
  );
};
