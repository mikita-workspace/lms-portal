import { getAppConfig } from '@/actions/config/get-app-config';

import { AuthFlow } from './_components/auth-flow';

const ConfigPage = async () => {
  const { id, authFlow: initialFlows } = await getAppConfig(true);

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium mb-12">App Configuration</h1>
      <AuthFlow id={id} initialFlows={initialFlows} />
    </div>
  );
};

export default ConfigPage;
