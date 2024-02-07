import { Lock } from 'lucide-react';

import { LoginButton } from '@/components/auth/login-button';

const SignInPage = () => {
  return (
    <div className="h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground">
        <Lock className="h-10 w-10" />
        <h1 className="text-xl md:text-3xl font-semibold">This content is protected.</h1>
        <p className="text-sm md:text-lg">To view, please login.</p>
        <LoginButton />
      </div>
    </div>
  );
};

export default SignInPage;
