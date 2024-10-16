'use client';

import { CsmCategory } from '@prisma/client';
import { Copyright } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { AuthStatus } from '@/constants/auth';
import { OWNER_EMAIL } from '@/constants/common';
import { useCurrentUser } from '@/hooks/use-current-user';

import { LanguageSwitcher } from '../common/language-switcher';
import { ThemeSwitcher } from '../common/theme-switcher';
import { CsmModal } from '../modals/csm-modal';

type FooterProps = {
  categories: CsmCategory[];
};

export const Footer = ({ categories }: FooterProps) => {
  const t = useTranslations('footer');
  const pathname = usePathname();

  const { user, status } = useCurrentUser();

  const showLanguageSwitcher = !user?.userId && status !== AuthStatus.LOADING;

  return (
    <>
      {!pathname?.includes('/chat') && (
        <footer className="md:p-4 p-2 w-full border-t bg-white dark:bg-neutral-950">
          <div className="text-xs text-muted-foreground py-2 px-2 flex flex-col md:items-end md:ml-[255px]">
            {showLanguageSwitcher && (
              <div className="mb-4 flex gap-x-2">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
            )}
            <div className="flex flex-col mb-4 md:items-end">
              <div className="flex items-center">
                <Copyright className="h-3 w-3" />
                <span> &nbsp;{new Date().getFullYear()}&nbsp;</span>
                <span>{t('copyright')}</span>
              </div>
              {/* Test Mode Declaimer */}
              <div className="items-end">{t('testModeDeclaimer')}</div>
            </div>
            <div className="gap-1 md:gap-2 font-semibold flex flex-col md:flex-row">
              <Link href="/releases">{t('releaseNotes')}</Link>
              <Link href="/terms-and-conditions">{t('termsAndCondition')}</Link>
              <Link href="/privacy-policy">{t('privacyPolicy')}</Link>
              <CsmModal categories={categories}>
                <span className="hover:cursor-pointer"> {t('reportIssue')}</span>
              </CsmModal>
              <Link href={`mailto:${OWNER_EMAIL}`} target="_blank">
                {t('contact')}
              </Link>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};
