'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { useChristmasStore } from '@/hooks/store/use-christmas-store';

const formSchema = z.object({
  isChristmas: z.boolean().default(false),
});

export const ChristmasForm = () => {
  const t = useTranslations('settings.christmas');

  const { isEnabled, onEnable } = useChristmasStore((state) => ({
    isEnabled: state.isEnabled,
    onEnable: state.onEnable,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isChristmas: isEnabled,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = (values: z.infer<typeof formSchema>) => onEnable(values.isChristmas);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="isChristmas"
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
