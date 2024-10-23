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
      <DialogContent className="sm:max-w-[445px] p-9">
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
};
