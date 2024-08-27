import { Lock, LogIn } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AuthModal } from '@/components/modals/auth-modal';
import { Button } from '@/components/ui/button';
import withCompanyLabel from '@/hoc/with-company-label';

const SignInPage = async () => {
  const t = await getTranslations('signIn');

  return (
    <div className="relative h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground">
        <Lock className="h-10 w-10" />
        <h1 className="text-xl md:text-3xl font-semibold">{t('title')}</h1>
        <p className="text-sm md:text-lg">{t('body')}</p>
        <AuthModal>
          <Button variant="outline">
            <LogIn className="h-4 w-4 mr-2" />
            {t('login')}
          </Button>
        </AuthModal>
      </div>
    </div>
  );
};

export default withCompanyLabel(SignInPage);
