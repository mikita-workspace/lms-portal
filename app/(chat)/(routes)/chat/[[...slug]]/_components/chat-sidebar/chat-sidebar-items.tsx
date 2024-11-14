'use client';

import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { EllipsisVertical, GlobeLock, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SyntheticEvent, useEffect, useState } from 'react';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import { ChatConversationModal } from '@/components/modals/chat-conversation-modal';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import { useChatStore } from '@/hooks/use-chat-store';
import { getChatMessages } from '@/lib/chat';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

type ChatSideBarItemsProps = {
  conversations: Conversation[];
};

export const ChatSideBarItems = ({ conversations }: ChatSideBarItemsProps) => {
  const { toast } = useToast();
  const t = useTranslations('chat.conversation');

  const router = useRouter();

  const { conversationId, setConversationId, chatMessages, setChatMessages } = useChatStore();

  const [editTitleId, setEditTitleId] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(chatMessages).length !== conversations.length) {
      setConversationId(conversations[0].id);
      setChatMessages(getChatMessages(conversations));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.length]);

  const handleOnClick = (event: SyntheticEvent, id: string) => {
    event.stopPropagation();

    setConversationId(id);

    if (editTitleId.length && id !== editTitleId) {
      setEditTitleId('');
    }
  };

  const handleRemoveConversation = async (id: string) => {
    setIsFetching(true);

    try {
      fetcher.delete(`/api/chat/conversation/${id}`);

      toast({
        title: t('removed-conversation', {
          conversation: conversations.find((conversation) => conversation.id === id)?.title,
        }),
      });

      router.refresh();
    } catch (error) {
      toast({ isError: true });
    } finally {
      setIsFetching(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {conversations.map((conversation, index) => {
              const isActive = conversationId === conversation.id;

              return (
                <Draggable key={conversation.id} draggableId={conversation.id} index={index}>
                  {(innerProvided) => (
                    <div
                      {...innerProvided.draggableProps}
                      className={cn(
                        'flex justify-between items-center transition-all duration-300 hover:bg-muted pr-2 hover:cursor-pointer text-sm text-muted-foreground font-[500] px-3 py-6',
                        isActive && 'text-primary bg-muted',
                      )}
                      ref={innerProvided.innerRef}
                      onClick={(event) => handleOnClick(event, conversation.id)}
                    >
                      <div
                        {...innerProvided.dragHandleProps}
                        className="flex justify-between items-center gap-x-2 pr-2"
                      >
                        <GripVertical
                          className={cn(
                            'text-muted-foreground h-5 w-5',
                            isActive && 'text-primary animate-spin-once',
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-x-2">
                        <GlobeLock className="w-4 h-4" />
                        <div className="line-clamp-1 flex-1">{conversation.title}</div>
                      </div>
                      <div className="ml-auto flex items-center gap-x-2">
                        {isActive && (
                          <DropdownMenu open={actionMenuOpen} onOpenChange={setActionMenuOpen}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="h-4 w-4 p-0 outline-none"
                                variant="ghost"
                                disabled={isFetching}
                              >
                                <EllipsisVertical className="w-4 h-4 cursor-pointer hover:opacity-75 transition duration-300" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <ChatConversationModal setActionMenuOpen={setActionMenuOpen}>
                                <button className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted hover:cursor-pointer">
                                  <Pencil className="h-4 w-4 mr-2" />
                                  {t('edit')}
                                </button>
                              </ChatConversationModal>
                              <DropdownMenuItem
                                className="hover:cursor-pointer text-red-500"
                                onClick={() => handleRemoveConversation(conversation.id)}
                                disabled={isFetching || conversations.length === 1}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('remove')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
