'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFlow as AuthFlowType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { authIcons } from '@/components/auth/auth-icons';
import { Switch } from '@/components/ui';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { OAUTH_LABELS, Provider } from '@/constants/auth';
import { fetcher } from '@/lib/fetcher';
import { capitalize } from '@/lib/utils';

type AuthFlowProps = {
  authFlow: AuthFlowType[];
};

const formSchema = z.object(
  Object.values(Provider).reduce((acc, cur) => {
    acc[cur as keyof typeof acc] = z.boolean().default(false) as never;

    return acc;
  }, {}),
);

export const AuthFlow = ({ authFlow }: AuthFlowProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: authFlow.reduce((acc, af) => {
      acc[af.provider as keyof typeof acc] = af.isActive as never;

      return acc;
    }, {}),
  });

  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetcher.patch('/api/config', {
        body: {
          authFlow: Object.entries(values).map(([provider, isActive]) => ({
            id: authFlow.find((af) => af.provider === provider)?.id,
            isActive: isActive,
          })),
        },
      });

      toast({ title: 'Auth providers updated' });
      router.refresh();
    } catch (error) {
      toast({
        description: 'Something went wrong. Try again!',
        title: 'Oops!',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-xl">Auth Providers</p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {Object.values(Provider).map((provider) => {
            const Icon = authIcons[provider];
            const flowLabel =
              OAUTH_LABELS[provider as keyof typeof OAUTH_LABELS] ?? capitalize(provider);

            const flow = authFlow.find((af) => af.provider === provider);

            if (flow) {
              return (
                <FormField
                  key={flow.id}
                  control={form.control}
                  name={flow.provider as never}
                  render={({ field }) => {
                    return (
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
                    );
                  }}
                />
              );
            }

            return null;
          })}
        </form>
      </Form>
    </div>
  );
};
