import { Lock, LogIn } from 'lucide-react';

import { LoginButton } from '@/components/auth/login-button';
import { Button } from '@/components/ui/button';

const SignInPage = () => {
  return (
    <div className="h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground">
        <Lock className="h-10 w-10" />
        <h1 className="text-xl md:text-3xl font-semibold">This content is protected.</h1>
        <p className="text-sm md:text-lg">To view, please login.</p>
        <LoginButton>
          <Button variant="outline">
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
        </LoginButton>
      </div>
    </div>
  );
};

export default SignInPage;
