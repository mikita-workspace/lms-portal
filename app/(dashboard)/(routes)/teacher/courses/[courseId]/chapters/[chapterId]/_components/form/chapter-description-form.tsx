'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter } from '@prisma/client';
import { Pencil, StopCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BsStars } from 'react-icons/bs';
import Markdown from 'react-markdown';
import ScrollToBottom from 'react-scroll-to-bottom';
import * as z from 'zod';

import { Editor } from '@/components/common/editor';
import { Preview } from '@/components/common/preview';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ChatCompletionRole, DEFAULT_SUMMARIZE_MODEL } from '@/constants/open-ai';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

type ChapterDescriptionFormProps = {
  chapterId: string;
  courseId: string;
  initialData: Chapter;
};

const formSchema = z.object({
  description: z.string().min(1),
});

export const ChapterDescriptionForm = ({
  chapterId,
  courseId,
  initialData,
}: ChapterDescriptionFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || '',
    },
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [improvedValue, setIsImprovedValue] = useState('');

  const { isSubmitting, isValid } = form.formState;

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetcher.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { body: values });

      toast.success('Chapter updated');
      setIsImprovedValue('');
      handleToggleEdit();

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleImproveAi = async () => {
    try {
      setIsImproving(true);

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const completionStream = await fetcher.post('/api/openai/completions', {
        body: {
          messages: [
            {
              role: ChatCompletionRole.USER,
              content: `There is a description of the course "${form.getValues().description}". Provide only answer.`,
            },
          ],
          system: {
            role: ChatCompletionRole.SYSTEM,
            content: 'You are the creator of various courses on a special learning platform.',
          },
          model: DEFAULT_SUMMARIZE_MODEL,
        },
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });

      const reader = completionStream.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      setIsImprovedValue('');

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

        setIsImprovedValue((prev) => prev + chunk);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast.error(String(error?.message));
      }
    } finally {
      setIsImproving(false);
    }
  };

  const handleAbortGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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
              disabled={isSubmitting || !isValid}
              variant="outline"
              size="sm"
              onClick={isImproving ? handleAbortGenerating : handleImproveAi}
            >
              {!isImproving && <BsStars className="mr-1" />}
              {isImproving && <StopCircle className="w-4 h-4 mr-1" />}
              {isImproving ? 'Stop' : 'Improve'}
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
        <div
          className={cn('text-sm mt-4', !initialData.description && 'text-neutral-500 italic mt-2')}
        >
          {initialData.description ? <Preview value={initialData.description} /> : 'No description'}
        </div>
      )}
      {isEditing && improvedValue && (
        <div className="my-4 flex flex-col gap-2">
          <p className="text-sm font-medium">Generated by AI</p>
          <ScrollToBottom
            className="flex h-[300px] w-full flex-co border-2 border-violet-500 rounded-lg"
            followButtonClassName="scroll-to-bottom-button"
          >
            <p className="text-sm prose dark:prose-invert prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline m-4">
              <Markdown>{improvedValue}</Markdown>
            </p>
          </ScrollToBottom>
        </div>
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
                    <Editor {...field} />
                  </FormControl>
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
