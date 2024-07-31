'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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
import { fetcher } from '@/lib/fetcher';
import { getFallbackName } from '@/lib/utils';

type GeneralSettingsFormProps = {
  initialData: User;
};

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  pictureUrl: z.string().url().min(1),
});

export const GeneralSettingsForm = ({ initialData }: GeneralSettingsFormProps) => {
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

  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetcher.patch(`/api/users/${initialData.id}`, { body: values });

      await update(values);

      toast.success('Account information updated');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-xl">Account Information</p>
        <span className="text-xs text-muted-foreground">
          The changes will be applied after a new login
        </span>
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
                    <FormLabel className="text-xs text-muted-foreground">Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} placeholder="Enter your name" />
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
                    <FormLabel className="text-xs text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled placeholder="Enter your email" />
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
                    <FormLabel className="text-xs text-muted-foreground">Avatar URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          placeholder="Enter your Avatar URL"
                        />
                        <Avatar>
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
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
