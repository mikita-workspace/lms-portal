'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Switch } from '@/components/ui';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { fetcher } from '@/lib/fetcher';

type PublicProfileFormProps = {
  initialData: User;
};

const formSchema = z.object({
  isPublic: z.boolean().default(false),
});

export const PublicProfileForm = ({ initialData }: PublicProfileFormProps) => {
  const t = useTranslations('settings.publicProfileForm');

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublic: Boolean(initialData.isPublic),
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetcher.patch(`/api/users/${initialData.id}`, { body: values });
      toast({ title: t('visibilityUpdated') });
      router.refresh();
    } catch (error) {
      toast({ isError: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>{t('title')}</FormLabel>
                <FormDescription className="text-xs">{t('body')}</FormDescription>
              </div>
              <FormControl>
                <Switch
                  aria-readonly
                  checked={field.value}
                  disabled={!isValid || isSubmitting}
                  onCheckedChange={field.onChange}
                  type="submit"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
