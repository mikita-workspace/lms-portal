import { AuthFlow } from './_components/auth-flow';

const ConfigPage = async () => {
  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium mb-12">App Configuration</h1>
      <AuthFlow
        initialFlows={{
          google: false,
          yandex: false,
          linkedin: false,
          slack: false,
          github: false,
        }}
      />
    </div>
  );
};

export default ConfigPage;
