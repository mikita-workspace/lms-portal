'use client';

import { Lock } from 'lucide-react';

import { LoginButton } from '@/components/auth';

const SignInPage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Lock className="h-10 w-10" />
      <h1 className="text-5xl mt-6 text-center">This content is protected.</h1>
      <p className="text-m text-muted-foreground mt-4 mb-10">To view, please login.</p>
      <LoginButton />
    </div>
  );
};

export default SignInPage;
