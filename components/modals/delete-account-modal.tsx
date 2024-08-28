'use client';

import { signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { SyntheticEvent, useEffect, useState } from 'react';

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
import { useToast } from '@/components/ui/use-toast';
import { fetcher } from '@/lib/fetcher';

import { Captcha } from '../common/captcha';
import { Button, Input } from '../ui';

type DeleteAccountModalProps = {
  children: React.ReactNode;
  email?: string | null;
  userId?: string;
};

export const DeleteAccountModal = ({ children, email, userId }: DeleteAccountModalProps) => {
  const t = useTranslations('delete-acc-modal');
  const locale = useLocale();

  const { toast } = useToast();

  const [input, setInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

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
      toast({ isError: true });
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
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('body')}</DialogDescription>
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: t.markup('confirmEmail', { strong: () => `<strong>${email}</strong>` }),
              }}
            />
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
            <div className="mt-6 z-10">
              <Captcha
                locale={locale}
                callback={(token) => {
                  if (token) {
                    setCaptchaToken(token);
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="mt-2">
                {t('cancel')}
              </Button>
            </DialogClose>
            <Button
              className="mt-2"
              disabled={isFetching || !isValid || !captchaToken}
              isLoading={isFetching}
              type="submit"
              variant="destructive"
            >
              {t('confirm')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
