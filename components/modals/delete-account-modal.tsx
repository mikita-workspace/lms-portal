'use client';

import { signOut } from 'next-auth/react';
import { SyntheticEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { fetcher } from '@/lib/fetcher';

import { Button, Input } from '../ui';

type DeleteAccountModalProps = {
  children: React.ReactNode;
  email?: string | null;
  userId?: string;
};

export const DeleteAccountModal = ({ children, email, userId }: DeleteAccountModalProps) => {
  const [input, setInput] = useState('');

  const [isFetching, setIsFetching] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(input === email);
  }, [email, input]);

  const handleDelete = async (event: SyntheticEvent) => {
    event.preventDefault();

    setIsFetching(true);

    try {
      await fetcher.delete(`/api/users/${userId}`);

      signOut({ callbackUrl: '/' });
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleDelete}>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? Deleting your account is permanent and
              will delete all your data forever.
            </DialogDescription>
            <p className="text-sm text-muted-foreground">
              Type <span className="font-bold">{email}</span> to confirm
            </p>
          </DialogHeader>
          <div className="w-full my-4">
            <div>
              <Input
                disabled={isFetching}
                name="price"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={isFetching || !isValid}
              isLoading={isFetching}
              type="submit"
              variant="destructive"
            >
              Yes, Delete Account Forever
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
