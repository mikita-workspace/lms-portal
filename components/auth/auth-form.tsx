'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { PASSWORD_VALIDATION, Provider } from '@/constants/auth';
import { useAppConfigStore } from '@/hooks/store/use-app-config-store';
import { useHydration } from '@/hooks/use-hydration';
import { cn, isValidUrl } from '@/lib/utils';

import { AuthFormSkeleton } from '../loaders/auth-form-skeleton';
import { Button, Input, Separator } from '../ui';
import { useToast } from '../ui/use-toast';
import { OAuthButton } from './ouath-button';
import { TermsAndPrivacy } from './terms-and-privacy';

type AuthFormProps = {
  callbackUrl?: string;
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

export const AuthForm = ({ callbackUrl }: AuthFormProps) => {
  const t = useTranslations('auth-form');
  const appName = useTranslations('app')('name');

  const { isMounted } = useHydration();

  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const { config } = useAppConfigStore((state) => ({ config: state.config }));
  const providers = config?.providers ?? {};
  const isBlockedNewLogin = config?.auth?.isBlockedNewLogin;

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

  if (!isMounted) {
    return <AuthFormSkeleton />;
  }

  const handleSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const response = await signIn('credentials', {
        ...values,
        callbackUrl,
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

  const isCredentialsProvider = providers[Provider.CREDENTIALS];

  return (
    <>
      <div>
        <div className="text-lg font-[600]">{t(`${isSignUpFlow ? 'signUp' : 'signIn'}`)}</div>
        <div className="text-base text-muted-foreground">{t('toContinue', { appName })}</div>
      </div>
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
          {!isBlockedNewLogin && <Separator />}
        </>
      )}

      <div
        className={cn(
          'space-y-2 w-full mt-2',
          isCredentialsProvider && 'flex items-end w-full justify-between space-x-2 mt-0',
        )}
      >
        {Object.values(Provider).map((provider) => {
          const isActiveProvider = providers[provider];

          if (provider !== Provider.CREDENTIALS && isActiveProvider) {
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
      {isCredentialsProvider && !isBlockedNewLogin && (
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
      {!isBlockedNewLogin && <TermsAndPrivacy />}
    </>
  );
};
