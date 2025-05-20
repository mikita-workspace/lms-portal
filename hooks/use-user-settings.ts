'use client';

import { UserSettings } from '@prisma/client';
import { useEffect } from 'react';

import { useUserSettingsStore } from './store/use-user-settings.store';

export const useUserSettings = (userSettings: UserSettings | null) => {
  const { setIsChristmasMode, setIsCopilotInNewTab, setIsPublicProfile } = useUserSettingsStore();

  useEffect(() => {
    setIsChristmasMode(Boolean(userSettings?.isChristmasMode));
    setIsCopilotInNewTab(Boolean(userSettings?.isCopilotInNewTab));
    setIsPublicProfile(Boolean(userSettings?.isPublicProfile));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
