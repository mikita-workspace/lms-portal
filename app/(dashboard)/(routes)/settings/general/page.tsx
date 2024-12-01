import { Flame } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { DeleteAccountModal } from '@/components/modals/delete-account-modal';
import { Button } from '@/components/ui';
import { db } from '@/lib/db';

import { AdvancedOptions } from './_components/advanced-options/advanced-options';
import { GeneralSettingsForm } from './_components/general-settings-form';

const SettingsPage = async () => {
  const t = await getTranslations('settings');

  const user = await getCurrentUser();
  const userInfo = await db.user.findUnique({ where: { id: user?.userId } });

  return (
    <div className="p-6 flex flex-col mb-6 md:max-w-[868px]">
      <h1 className="text-2xl font-medium">{t('general')}</h1>
      {userInfo && (
        <div className="mt-12">
          <GeneralSettingsForm initialData={userInfo} />
          <AdvancedOptions initialData={userInfo} />
        </div>
      )}
      <DeleteAccountModal userId={user?.userId} email={user?.email}>
        <div className="flex items-center gap-x-2 mt-8">
          <Button variant="destructive">
            <Flame className="h-4 w-4 mr-2" />
            {t('deleteAcc')}
          </Button>
        </div>
      </DeleteAccountModal>
    </div>
  );
};

export default SettingsPage;
