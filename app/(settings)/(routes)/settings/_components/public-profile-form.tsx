'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { Label, Switch } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { fetcher } from '@/lib/fetcher';

type PublicProfileFormProps = {
  initialData: User;
};

const formSchema = z.object({
  isPublic: z.boolean().default(false),
});

export const PublicProfileForm = ({ initialData }: PublicProfileFormProps) => {
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

      toast.success('Visibility updated');

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-8">
      <p className="font-medium text-xl">Public Profile</p>
      <Form {...form}>
        <form className="mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="visibility"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="visibility">Enable Public Profile</Label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center mt-6">
            <Button disabled={!isValid || isSubmitting} isLoading={isSubmitting} type="submit">
              Update visibility
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
