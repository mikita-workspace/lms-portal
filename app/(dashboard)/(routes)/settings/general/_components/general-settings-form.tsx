'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Avatar, AvatarFallback, AvatarImage, Button, Input } from '@/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { TIMESTAMP_USER_PROFILE_TEMPLATE } from '@/constants/common';
import { useLocaleStore } from '@/hooks/use-locale-store';
import { fetcher } from '@/lib/fetcher';
import { getFallbackName } from '@/lib/utils';

type GeneralSettingsFormProps = {
  initialData: User;
};

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  pictureUrl: z.string().url().min(1).optional().or(z.literal('')),
});

export const GeneralSettingsForm = ({ initialData }: GeneralSettingsFormProps) => {
  const t = useTranslations('settings.generalForm');

  const localeInfo = useLocaleStore((state) => state.localeInfo);

  const { toast } = useToast();
  const { update } = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      pictureUrl: initialData.pictureUrl || '',
    },
  });

  console.log(localeInfo);

  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetcher.patch(`/api/users/${initialData.id}`, { body: values });

      await update(values);

      toast({ title: t('accInfoUpdated') });
      router.refresh();
    } catch (error) {
      toast({ isError: true });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-xl">{t('accInfo')}</p>
        <p className="text-xs text-muted-foreground">
          {t('lastUpdated')}&nbsp;{format(initialData.updatedAt, TIMESTAMP_USER_PROFILE_TEMPLATE)}
        </p>
        {localeInfo && (
          <p className="flex items-center gap-x-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>
              {localeInfo.details.city}, {localeInfo.details.country} (
              {localeInfo.details.countryCode}) | {localeInfo.locale.currency} (
              {localeInfo.locale.locale})
            </span>
          </p>
        )}
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">{t('name')}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} placeholder={t('enterName')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">{t('email')}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled placeholder={t('enterEmail')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pictureUrl"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-xs text-muted-foreground">{t('avatar')}</FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        <Input {...field} disabled={isSubmitting} placeholder={t('enterAvatar')} />
                        <Avatar className="border dark:border-muted-foreground">
                          <AvatarImage src={field.value || ''} />
                          <AvatarFallback>{getFallbackName(initialData.name || '')}</AvatarFallback>
                        </Avatar>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-x-2 mt-6">
              <Button disabled={!isValid || isSubmitting} isLoading={isSubmitting} type="submit">
                {t('update')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
