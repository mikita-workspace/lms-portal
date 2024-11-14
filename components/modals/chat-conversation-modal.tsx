'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CONVERSATION_ACTION } from '@/constants/chat';
import { useChatStore } from '@/hooks/use-chat-store';
import { generateConversationTitle } from '@/lib/chat';
import { fetcher } from '@/lib/fetcher';

import { Button, Input } from '../ui';
import { useToast } from '../ui/use-toast';

type ChatConversationModalProps = {
  children?: React.ReactNode;
  setActionMenuOpen?: (value: boolean) => void;
};

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChatConversationModal = ({
  children,
  setActionMenuOpen,
}: ChatConversationModalProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const { setConversationId } = useChatStore((state) => ({
    setConversationId: state.setConversationId,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const [open, setOpen] = useState(false);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    setActionMenuOpen?.(value);
    document.body.style.pointerEvents = '';
  };

  const handleGenerateTitle = (onChange: (value: string) => void) => {
    const title = generateConversationTitle();

    onChange(title);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetcher.post(
        `/api/chat/conversations?action=${CONVERSATION_ACTION.NEW}`,
        { body: { ...values }, responseType: 'json' },
      );

      setConversationId(response?.id ?? '');
      router.refresh();
    } catch (error) {
      toast({ isError: true });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => handleOpenChange(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add conversation</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g. New conversation"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleGenerateTitle(field.onChange)}
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={!isValid || isSubmitting} isLoading={isSubmitting} type="submit">
                submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
