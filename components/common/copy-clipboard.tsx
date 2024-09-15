'use client';

import { Copy } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type CopyClipboardProps = {
  className?: string;
  disabled?: boolean;
  textToCopy: string;
};

export const CopyClipboard = ({ className, disabled = false, textToCopy }: CopyClipboardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(textToCopy);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <button onClick={handleCopyToClipboard} disabled={disabled}>
      <Copy className={cn('h-4 w-4', copied ? 'animate-spin-once' : '', className)} />
    </button>
  );
};
