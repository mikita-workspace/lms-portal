'use client';

import { Loader2 } from 'lucide-react';

export const CommonLoader = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Loader2 className="h-4 w-4 animate-spin text-secondary-foreground mr-2" />
    <p className="text-sm">Loading...</p>
  </div>
);
