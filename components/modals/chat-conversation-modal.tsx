'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CONVERSATION_ACTION } from '@/constants/chat';
import { useChatStore } from '@/hooks/use-chat-store';
import { generateConversationTitle } from '@/lib/chat';
import { fetcher } from '@/lib/fetcher';

import { Button, Checkbox, Input } from '../ui';
import { useToast } from '../ui/use-toast';

type ChatConversationModalProps = {
  initialData?: Conversation;
  isEdit?: boolean;
  open?: boolean;
  setOpen?: (value: boolean) => void;
};

const formSchema = z.object({
  isOnlyAuth: z.boolean().default(false).optional(),
  isShared: z.boolean().default(false).optional(),
  title: z.string().min(1),
});

export const ChatConversationModal = ({
  initialData,
  isEdit = false,
  open = false,
  setOpen,
}: ChatConversationModalProps) => {
  const t = useTranslations('chat-conversation-modal');

  const { toast } = useToast();

  const router = useRouter();

  const { setConversationId } = useChatStore((state) => ({
    setConversationId: state.setConversationId,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isOnlyAuth: false,
      isShared: false,
      title: initialData?.title ?? '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sharedLink, setSharedLink] = useState('');

  const watchIsShared = form.watch('isShared');

  const handleOpenChange = (value: boolean) => {
    setOpen?.(value);
  };

  const handleGenerateTitle = (onChange: (value: string) => void) => {
    const title = generateConversationTitle();

    onChange(title);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = isEdit
        ? await fetcher.patch(
            `/api/chat/conversations/${initialData?.id}?action=${CONVERSATION_ACTION.EDIT}`,
            { body: { ...values }, responseType: 'json' },
          )
        : await fetcher.post(`/api/chat/conversations?action=${CONVERSATION_ACTION.NEW}`, {
            body: { ...values },
            responseType: 'json',
          });

      setConversationId(response?.id ?? '');
      router.refresh();
    } catch (error) {
      toast({ isError: true });
    } finally {
      setOpen?.(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => handleOpenChange(open)}>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t(isEdit ? 'titleEdit' : 'titleAdd')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t('title')}</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          {...field}
                          aria-hidden="true"
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
              <p className="text-sm font-medium pt-2">{t('sharedAccess')}</p>
              <FormField
                control={form.control}
                name="isShared"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>{t('openAccess')}</FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isOnlyAuth"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!watchIsShared || isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>{t('onlyAuth')}</FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <div className="w-full flex justify-between">
                  <Button variant="outline" disabled={isSubmitting || !sharedLink} type="button">
                    <div className="flex items-center gap-x-2">
                      <Link className="w-4 h-4" />
                      <span>{t('copyLink')}</span>
                    </div>
                  </Button>
                  <Button
                    disabled={!isValid || isSubmitting}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    {t('submit')}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
