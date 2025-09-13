'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { PASSWORD_VALIDATION, Provider } from '@/constants/auth';
import { useAppConfigStore } from '@/hooks/store/use-app-config-store';
import { useHydration } from '@/hooks/use-hydration';
import { isValidUrl } from '@/lib/utils';

import { CaptchaInvisible } from '../common/captcha-invisible';
import { AuthFormSkeleton } from '../loaders/auth-form-skeleton';
import { Button, Input } from '../ui';
import { useToast } from '../ui/use-toast';
import { OAuthButtons } from './oauth-buttons';
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
  const locale = useLocale();

  const { config } = useAppConfigStore((state) => ({ config: state.config }));
  const { isBlockedNewLogin = false, providers = {} } = config?.auth ?? {};

  const [isDisabledButtons, setIsDisabledButtons] = useState(false);
  const [isSignUpFlow, setIsSignUpFlow] = useState(false);

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaVisible, setCaptchaVisible] = useState(false);

  const [data, setData] = useState<z.infer<typeof signUpSchema> | null>(null);

  const validationSchema = useMemo(
    () => (isSignUpFlow ? signUpSchema : signInSchema),
    [isSignUpFlow],
  );

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      ...(isSignUpFlow && { name: '' }),
      email: '',
      password: '',
    },
  });

  const { isSubmitting, errors } = form.formState;

  const handleSubmit = useCallback(async (data: z.infer<typeof signUpSchema>) => {
    setCaptchaVisible(true);
    setData(data);
  }, []);

  useEffect(() => {
    const handleSubmitCallback = async () => {
      try {
        setIsDisabledButtons(true);
        const response = await signIn('credentials', {
          ...data,
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
            toast({
              description: response.error,
              isError: true,
            });
        }
      } catch (error) {
        toast({ isError: true });
      } finally {
        setIsDisabledButtons(false);
      }
    };

    if (captchaToken && data) {
      handleSubmitCallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  if (!isMounted) {
    return <AuthFormSkeleton />;
  }

  const hasCredentialsProvider = providers?.[Provider.CREDENTIALS];

  return (
    <>
      <div>
        <div className="text-lg font-[600]">{t(`${isSignUpFlow ? 'signUp' : 'signIn'}`)}</div>
        <div className="text-base text-muted-foreground">{t('toContinue', { appName })}</div>
      </div>
      {hasCredentialsProvider && (
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
        </>
      )}
      <OAuthButtons
        hasCredentialsProvider={hasCredentialsProvider}
        isDisabledButtons={isDisabledButtons}
        providers={providers}
        setIsDisabledButtons={setIsDisabledButtons}
      />
      <CaptchaInvisible
        callback={(token) => {
          if (token) {
            setCaptchaToken(token);
          }
        }}
        locale={locale}
        setVisible={setCaptchaVisible}
        visible={captchaVisible}
      />
      {hasCredentialsProvider && !isBlockedNewLogin && (
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
