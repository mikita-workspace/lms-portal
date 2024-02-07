'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter, Course } from '@prisma/client';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { Input } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { TEXTAREA_MAX_LENGTH } from '@/constants/common';
import { cn } from '@/lib/utils';

type ChaptersFormProps = {
  courseId: string;
  initialData: Course & { chapters: Chapter[] };
};

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { isSubmitting, isValid } = form.formState;

  const handleToggleCreating = () => setIsCreating((prev) => !prev);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);

      toast.success('Chapter created');
      handleToggleCreating();

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="mt-6 border  bg-neutral-100 dark:bg-neutral-900 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapters
        <Button onClick={handleToggleCreating} variant="outline">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      maxLength={TEXTAREA_MAX_LENGTH}
                      placeholder="e.g. 'Introduction to the course'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} isLoading={isSubmitting} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && (
        <>
          <div
            className={cn(
              'text-sm mr-2',
              !initialData.chapters.length && 'text-neutral-500 italic',
            )}
          >
            {!initialData.chapters.length && 'No chapters'}
            {/* TODO: List of chapters here */}
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            Drag and drop to reorder the chapters
          </div>
        </>
      )}
    </div>
  );
};
