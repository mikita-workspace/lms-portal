'use client';

import { Copyright } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  GITHUB_ISSUE_URL,
  OWNER_COPYRIGHT,
  OWNER_EMAIL,
  PRIVACY_POLICY_URL,
  TERMS_AND_CONDITIONS_URL,
} from '@/constants/common';

export const Footer = () => {
  const pathname = usePathname();

  return (
    <>
      {!pathname?.includes('/chat') && (
        <footer className="md:p-4 p-2 w-full border-t bg-white dark:bg-neutral-950">
          <div className="text-xs text-muted-foreground py-2 px-2 flex flex-col md:items-end md:ml-[255px]">
            <div className="flex items-center mb-2">
              <Copyright className="h-3 w-3" />
              &nbsp;
              <span>{new Date().getFullYear()}</span>
              &nbsp;
              <span>{OWNER_COPYRIGHT}</span>
            </div>
            <div className="md:space-x-2 font-semibold flex flex-col md:flex-row">
              <Link href={`mailto:${OWNER_EMAIL}`}>Contact</Link>
              <Link href={GITHUB_ISSUE_URL} target="_blank">
                Report Issue
              </Link>
              <Link href={TERMS_AND_CONDITIONS_URL} target="_blank">
                Terms and Conditions
              </Link>
              <Link href={PRIVACY_POLICY_URL} target="_blank">
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};
