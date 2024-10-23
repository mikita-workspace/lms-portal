import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { AuthForm } from '@/components/auth/auth-form';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { Logo } from '@/components/common/logo';
import { ThemeSwitcher } from '@/components/common/theme-switcher';

const SignInPage = async () => {
  const user = await getCurrentUser();

  if (user?.userId) {
    return redirect('/');
  }

  const t = await getTranslations('signIn');

  return (
    <div className="container relative max-w-[445px] h-full flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-[url('/assets/login-bg.svg')] bg-no-repeat bg-cover" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo onlyDarkMode />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">&ldquo;{t('citeBody')}&rdquo;</p>
            <footer className="text-sm">{t('citeAuthor')}</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <AuthForm />
        </div>
        <div className="fixed flex gap-x-2 bottom-0 right-0 mb-6 mr-6 text-xs text-muted-foreground gap-y-4 items-end">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
