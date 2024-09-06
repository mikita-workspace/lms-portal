'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { PASSWORD_VALIDATION, Provider } from '@/constants/auth';
import { useAppConfigStore } from '@/hooks/use-app-config-store';
import { cn, isValidUrl } from '@/lib/utils';

import { OAuthButton } from '../auth/ouath-button';
import { TermsAndPrivacy } from '../auth/terms-and-privacy';
import { Separator } from '../ui';

type AuthModalProps = {
  children: React.ReactNode;
  ignore?: boolean;
};

const signInSchema = z.object({
  email: z.string().min(8, { message: 'errors.email' }).email({ message: 'errors.invalidEmail' }),
  password: z.string().min(4, { message: 'errors.password' }).regex(PASSWORD_VALIDATION, {
    message: 'errors.passwordRules',
  }),
});

const signUpSchema = z.intersection(
  signInSchema,
  z.object({ name: z.string().min(4, { message: 'errors.username' }).trim() }),
);

export const AuthModal = ({ children, ignore = false }: AuthModalProps) => {
  const t = useTranslations('auth-modal');
  const appName = useTranslations('app')('name');

  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const { authFlow } = useAppConfigStore((state) => ({ authFlow: state.authFlow }));

  const [isDisabledButtons, setIsDisabledButtons] = useState(false);
  const [isSignUpFlow, setIsSignUpFlow] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(isSignUpFlow ? signUpSchema : signInSchema),
    defaultValues: {
      ...(isSignUpFlow && { name: '' }),
      email: '',
      password: '',
    },
  });

  const { isSubmitting, errors } = form.formState;

  const handleSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const response = await signIn('credentials', {
        ...values,
        isSignUpFlow,
        redirect: false,
      });

      switch (true) {
        case !response?.error:
          router.push('/');
          router.refresh();
          break;
        case isValidUrl(response?.error ?? ''):
          router.push(response.error);
          break;
        default:
          setIsDisabledButtons(false);
          toast({
            description: response.error,
            isError: true,
          });
      }
    } catch (error) {
      toast({ isError: true });
    }
  };

  const isCredentialsProvider = authFlow.find(
    (fl) => fl.provider === Provider.CREDENTIALS,
  )?.isActive;

  return ignore ? (
    children
  ) : (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[445px] p-9">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-[600] flex gap-x-2 items-center justify-center sm:justify-start">
            <Image src="/assets/logo.svg" alt={`${t('novaId')} Logo`} height={25} width={25} />
            <p>{t('novaId')}</p>
          </DialogTitle>
        </DialogHeader>
        {isCredentialsProvider && (
          <>
            <Form {...form}>
              <form className="space-y-4 mb-2" onSubmit={form.handleSubmit(handleSubmit)}>
                {isSignUpFlow && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isSubmitting || isDisabledButtons}
                            placeholder={t('username')}
                          />
                        </FormControl>
                        {errors?.name?.message && (
                          <p className="text-xs text-red-500">
                            {t(errors.name.message.toLowerCase())}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting || isDisabledButtons}
                          placeholder={t('email')}
                          type="email"
                        />
                      </FormControl>
                      {errors?.email?.message && (
                        <p className="text-xs text-red-500">{t(errors.email.message)}</p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting || isDisabledButtons}
                          placeholder={t('password')}
                          type="password"
                        />
                      </FormControl>
                      {errors?.password?.message && (
                        <p className="text-xs text-red-500">{t(errors.password.message)}</p>
                      )}
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2">
                  <Button
                    className="w-full"
                    disabled={isSubmitting || isDisabledButtons}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    {t(`${isSignUpFlow ? 'signUp' : 'signIn'}`)}
                  </Button>
                </div>
              </form>
            </Form>
            <Separator />
          </>
        )}
        <Suspense>
          <div
            className={cn(
              'space-y-2 w-full mt-2',
              isCredentialsProvider && 'flex items-end w-full justify-between space-x-2 mt-0',
            )}
          >
            {Object.values(Provider).map((provider) => {
              const flow = authFlow.find(
                (fl) => fl.provider === provider && fl.provider !== Provider.CREDENTIALS,
              );

              if (flow && flow.isActive) {
                return (
                  <OAuthButton
                    key={provider}
                    disabled={isDisabledButtons}
                    isCredentialsProvider={isCredentialsProvider}
                    provider={provider as Provider}
                    setIsDisabled={setIsDisabledButtons}
                  />
                );
              }

              return null;
            })}
          </div>
        </Suspense>
        {isCredentialsProvider && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            {t(`${isSignUpFlow ? 'alreadyHaveAnAccount' : 'doNotHaveAnAccount'}`)}{' '}
            <Link
              className="text-primary hover:underline"
              href={pathname}
              onClick={() => setIsSignUpFlow((prev) => !prev)}
            >
              {t(`${isSignUpFlow ? 'signIn' : 'signUp'}`)}
            </Link>
          </p>
        )}
        <DialogFooter>
          <TermsAndPrivacy />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
