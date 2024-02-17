'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Course } from '@prisma/client';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BsStars } from 'react-icons/bs';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { TEXTAREA_MAX_LENGTH } from '@/constants/common';
import { ChatCompletionRole, DEFAULT_SUMMARIZE_MODEL } from '@/constants/open-ai';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

type DescriptionFormProps = {
  courseId: string;
  initialData: Course;
};

const formSchema = z.object({
  description: z.string().min(1).max(TEXTAREA_MAX_LENGTH),
});

export const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || '',
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const { isSubmitting, isValid } = form.formState;

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetcher.patch(`/api/courses/${courseId}`, { body: values });

      toast.success('Course updated');
      handleToggleEdit();

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleImproveAi = async () => {
    try {
      setIsImproving(true);

      const completionStream = await fetcher.post('/api/openai/completions', {
        body: {
          messages: [
            {
              role: ChatCompletionRole.USER,
              content: `There is a short description of the course "${form.getValues().description}". Improve it. Maximum output symbols - ${Math.round(TEXTAREA_MAX_LENGTH / 1.4)}`,
            },
          ],
          cache: 'no-cache',
          system: {
            role: ChatCompletionRole.SYSTEM,
            content: 'You are the creator of various courses on a special learning platform.',
          },
          model: DEFAULT_SUMMARIZE_MODEL,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const reader = completionStream.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      form.setValue('description', '');

      while (true) {
        const rawChunk = await reader?.read();

        if (!rawChunk) {
          throw new Error('Unable to process chunk');
        }

        const { done, value } = rawChunk;

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);

        form.setValue('description', form.getValues().description + chunk);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast.error(String(error?.message));
      }
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="mt-6 border  bg-neutral-100 dark:bg-neutral-900 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Description
        <div className="flex items-center gap-x-2">
          {isEditing && (
            <Button
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:text-white font-medium z-10 px-2"
              disabled={isSubmitting || isImproving || !isValid}
              variant="outline"
              size="sm"
              onClick={handleImproveAi}
            >
              <BsStars className="mr-1" />
              Improve
            </Button>
          )}
          <Button onClick={handleToggleEdit} variant="outline" size="sm">
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>
      {!isEditing && (
        <p
          className={cn('text-sm mt-4', !initialData.description && 'text-neutral-500 italic mt-2')}
        >
          {initialData.description || 'No description'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      maxLength={TEXTAREA_MAX_LENGTH}
                      placeholder="e.g. 'This course is about ...'"
                    />
                  </FormControl>
                  <FormDescription
                    className={cn(
                      'text-xs text-end',
                      form.watch('description').length >= TEXTAREA_MAX_LENGTH && 'text-red-600',
                    )}
                  >{`${form.watch('description').length}/${TEXTAREA_MAX_LENGTH}`}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} isLoading={isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
