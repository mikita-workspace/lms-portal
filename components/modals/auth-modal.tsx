'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { AuthForm } from '../auth/auth-form';

type AuthModalProps = {
  children: React.ReactNode;
  ignore?: boolean;
};

export const AuthModal = ({ children, ignore = false }: AuthModalProps) => {
  return ignore ? (
    children
  ) : (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[445px] max-w-max p-9 sm:h-auto h-full sm:w-auto w-full flex flex-col justify-center">
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
};
