'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { authIcons } from '@/components/auth/auth-icons';
import { Switch } from '@/components/ui';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { OAUTH_LABELS, Provider } from '@/constants/auth';
import { capitalize } from '@/lib/utils';

type AuthFlowProps = {
  initialFlows: Record<Provider, boolean>;
};

const formSchema = z.object(
  Object.values(Provider).reduce((acc, cur) => {
    acc[cur as keyof typeof acc] = z.boolean().default(false) as never;

    return acc;
  }, {}),
);

export const AuthFlow = ({ initialFlows }: AuthFlowProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFlows,
  });

  const { isSubmitting, isValid } = form.formState;

  const flows = Object.keys(initialFlows);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // await fetcher.patch(`/api/users/${initialData.id}`, { body: values });
      console.log(values);

      toast.success('Auth flow updated');

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-xl">Auth Flow</p>
          <span className="text-xs text-muted-foreground">Caching every 10 minutes</span>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {flows.map((flow) => {
            const Icon = authIcons[flow as Provider];
            const flowLabel = OAUTH_LABELS[flow as keyof typeof OAUTH_LABELS] ?? capitalize(flow);

            return (
              <FormField
                key={flow}
                control={form.control}
                name={flow as never}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4 mb-2">
                    <div className="flex items-center">
                      <Icon className="mr-4" size={20} />
                      <FormLabel>{flowLabel}</FormLabel>
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
            );
          })}
        </form>
      </Form>
    </div>
  );
};
