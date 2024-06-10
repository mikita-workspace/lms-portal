import { Flame } from 'lucide-react';
import { Metadata } from 'next';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { DeleteAccountModal } from '@/components/modals/delete-account-modal';
import { Button } from '@/components/ui';
import { db } from '@/lib/db';

import { GeneralSettingsForm } from './_components/general-settings-form';
import { PublicProfileForm } from './_components/public-profile-form';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Educational portal',
};

const SettingsPage = async () => {
  const user = await getCurrentUser();
  const userInfo = await db.user.findUnique({ where: { id: user?.userId } });

  return (
    <div className="p-6 flex flex-col mb-6 md:max-w-[868px]">
      <h1 className="text-2xl font-medium">General Settings</h1>
      <div className="mt-12">
        <GeneralSettingsForm initialData={userInfo!} />
        <PublicProfileForm initialData={userInfo!} />
      </div>
      <DeleteAccountModal userId={user?.userId} email={user?.email}>
        <div className="flex items-center gap-x-2 mt-8">
          <Button variant="destructive">
            <Flame className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </DeleteAccountModal>
    </div>
  );
};

export default SettingsPage;
