'use client';

import { Copyright, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  NOVA_CHAT_URL,
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
              <span>Mikita&nbsp;Kandratsyeu. All rights reserved.</span>
            </div>
            <div className="md:space-x-2 font-semibold flex flex-col md:flex-row">
              <Link href={NOVA_CHAT_URL} target="_blank" className="flex items-baseline">
                <div className="flex items-center">
                  NovaChat&nbsp;|&nbsp;GPT&nbsp;
                  <ExternalLink className="h-3 w-3" />
                </div>
              </Link>
              <Link href={`mailto:${OWNER_EMAIL}`}>Contact</Link>
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
