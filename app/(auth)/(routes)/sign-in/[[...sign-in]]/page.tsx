import { Lock, LogIn } from 'lucide-react';

import { Logo } from '@/components/common/logo';
import { AuthModal } from '@/components/modals/auth-modal';
import { Button } from '@/components/ui/button';

const SignInPage = () => {
  return (
    <div className="relative h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground">
        <Lock className="h-10 w-10" />
        <h1 className="text-xl md:text-3xl font-semibold">This content is protected.</h1>
        <p className="text-sm md:text-lg">To view, please login.</p>
        <AuthModal>
          <Button variant="outline">
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
        </AuthModal>
      </div>
      <div className="absolute flex justify-center items-center mb-8 bottom-0 gap-x-1 w-full text-sm text-muted-foreground">
        Powered by
        <div className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-x-1">
          <div className="h-4 w-4">
            <Logo onlyLogoIcon isChat />
          </div>
          <span>Nova LMS</span>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
