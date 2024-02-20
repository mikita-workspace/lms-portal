import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

import { GeneralSettingsForm } from './_components/general-settings-form';
import { PublicProfileForm } from './_components/public-profile-form';

const SettingsPage = async () => {
  const user = await getCurrentUser();
  const userInfo = await db.user.findUnique({ where: { id: user?.userId } });

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium">General Settings</h1>
      <div className="mt-12">
        <GeneralSettingsForm initialData={userInfo!} />
        <PublicProfileForm initialData={userInfo!} />
      </div>
    </div>
  );
};

export default SettingsPage;
