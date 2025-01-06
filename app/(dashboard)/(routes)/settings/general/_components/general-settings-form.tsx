'use client';

import { User } from '@prisma/client';
import { format } from 'date-fns';
import { BadgeDollarSign, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { UpdateProfileImageModal } from '@/components/modals/update-profile-image-modal';
import { Avatar, AvatarFallback, AvatarImage, Input } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import { TIMESTAMP_USER_PROFILE_TEMPLATE } from '@/constants/common';
import { useLocaleStore } from '@/hooks/store/use-locale-store';
import { useDebounce } from '@/hooks/use-debounce';
import { fetcher } from '@/lib/fetcher';
import { getFallbackName } from '@/lib/utils';

type GeneralSettingsFormProps = {
  initialData: User;
};

export const GeneralSettingsForm = ({ initialData }: GeneralSettingsFormProps) => {
  const t = useTranslations('settings.generalForm');

  const localeInfo = useLocaleStore((state) => state.localeInfo);

  const { toast } = useToast();
  const { update } = useSession();
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || '');
  const [isFetching, setIsFetching] = useState(false);

  const debouncedValue = useDebounce(name);

  const handleSubmit = async (values: Record<string, string | null>) => {
    setIsFetching(true);

    try {
      await fetcher.patch(`/api/users/${initialData.id}`, { body: values });

      await update(values);

      toast({ title: t('accInfoUpdated') });
      router.refresh();
    } catch (error) {
      toast({ isError: true });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (debouncedValue.length > 0 && debouncedValue !== initialData.name) {
      handleSubmit({ name: debouncedValue, pictureUrl: initialData?.pictureUrl ?? '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-xl">{t('accInfo')}</p>
        <p className="text-xs text-muted-foreground">
          {t('lastUpdated')}&nbsp;{format(initialData.updatedAt, TIMESTAMP_USER_PROFILE_TEMPLATE)}
        </p>
        {localeInfo && (
          <div className="flex flex-col gap-y-1">
            <p className="flex items-center gap-x-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>
                {localeInfo.details.city}, {localeInfo.details.country} (
                {localeInfo.details.countryCode}, {localeInfo.locale.locale})
              </span>
            </p>
            <p className="flex items-center gap-x-1 text-xs text-muted-foreground">
              <BadgeDollarSign className="h-3 w-3" />
              <span>{localeInfo.locale.currency}</span>
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-4 w-full">
        <UpdateProfileImageModal>
          <button disabled={isFetching}>
            <Avatar className="border dark:border-muted-foreground w-24 h-24">
              <AvatarImage src={initialData?.pictureUrl ?? ''} />
              <AvatarFallback>{getFallbackName(initialData?.name || '')}</AvatarFallback>
            </Avatar>
          </button>
        </UpdateProfileImageModal>
        <div className="flex flex-col gap-y-4 flex-1">
          <div className="flex flex-col gap-y-2">
            <div className="text-xs text-muted-foreground font-medium">{t('name')}</div>
            <Input
              disabled={isFetching}
              placeholder={t('enterName')}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="text-xs text-muted-foreground font-medium">{t('email')}</div>
            <Input disabled placeholder={t('enterEmail')} value={initialData.email} />
          </div>
        </div>
      </div>
    </div>
  );
};
