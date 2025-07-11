'use client';

import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { EllipsisVertical, Globe, GlobeLock, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SyntheticEvent, useEffect, useState } from 'react';
import { GrClearOption } from 'react-icons/gr';

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
import { CONVERSATION_ACTION } from '@/constants/chat';
import { useChatStore } from '@/hooks/store/use-chat-store';
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

  const {
    chatMessages,
    conversationId,
    isFetching,
    setChatMessages,
    setConversationId,
    setIsFetching,
  } = useChatStore();

  const [clientConversations, setClientConversations] = useState(conversations);
  const [editTitleId, setEditTitleId] = useState('');
  const [isReordering, setIsReordering] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const currentConversation = conversations.find(
    (conversation) => conversation.id === conversationId,
  );

  useEffect(() => {
    setClientConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    document.body.style.removeProperty('pointer-events');
  }, [open]);

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

  const handleDeleteMessages = async (id: string) => {
    setIsFetching(true);

    try {
      const updatedChatMessages = {
        ...chatMessages,
        [id]: [],
      };

      await fetcher.patch(
        `/api/chat/conversations/${id}?action=${CONVERSATION_ACTION.EMPTY_MESSAGES}`,
      );

      setChatMessages(updatedChatMessages);
    } catch (error) {
      console.error('[CHAT-SIDEBAR-ITEMS]', error);

      toast({ isError: true });
    } finally {
      setIsFetching(false);
    }
  };

  const handleRemoveConversation = async (id: string) => {
    setIsFetching(true);

    try {
      fetcher.delete(`/api/chat/conversations/${id}`);

      toast({
        title: t('removed-conversation', {
          conversation: conversations.find((conversation) => conversation.id === id)?.title,
        }),
      });

      router.refresh();
    } catch (error) {
      console.error('[CHAT-SIDEBAR-ITEMS]', error);

      toast({ isError: true });
    } finally {
      setIsFetching(false);
    }
  };

  const handleReorder = async (updatedData: { id: string; position: number }[]) => {
    try {
      setIsFetching(true);
      setIsReordering(true);

      await fetcher.put('/api/chat/conversations/reorder', {
        body: { list: updatedData },
        responseType: 'json',
      });

      router.refresh();
    } catch (error) {
      console.error('[CHAT-SIDEBAR-ITEMS]', error);

      toast({ isError: true });
    } finally {
      setIsFetching(false);
      setIsReordering(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const copyConversations = Array.from(conversations);
    const [reorderedItem] = copyConversations.splice(result.source.index, 1);
    copyConversations.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedConversations = copyConversations.slice(startIndex, endIndex + 1);

    setClientConversations(copyConversations);

    const bulkUpdateData = updatedConversations.map((conversation) => ({
      id: conversation.id,
      position: copyConversations.findIndex((item) => item.id === conversation.id),
    }));

    handleReorder(bulkUpdateData);
  };

  return (
    <>
      {open && (
        <ChatConversationModal
          open={open}
          setOpen={setOpen}
          initialData={currentConversation}
          isEdit
        />
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="conversations" isDropDisabled={isFetching}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {clientConversations.map((conversation, index) => {
                const isActive = conversationId === conversation.id;
                const isShared = conversation.shared.isShared;

                return (
                  <Draggable
                    draggableId={conversation.id}
                    index={index}
                    isDragDisabled={isReordering}
                    key={conversation.id}
                  >
                    {(innerProvided) => (
                      <div
                        {...innerProvided.draggableProps}
                        aria-hidden="true"
                        className={cn(
                          'flex justify-between items-center transition-all duration-300 hover:bg-muted pr-2 hover:cursor-pointer text-sm text-muted-foreground font-[500] px-3 py-6',
                          isActive && 'text-primary bg-muted',
                          isFetching && 'cursor-not-allowed pointer-events-none',
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
                          {isShared && <Globe className="w-4 h-4" />}
                          {!isShared && <GlobeLock className="w-4 h-4" />}
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
                                <DropdownMenuItem
                                  className="hover:cursor-pointer"
                                  disabled={isFetching}
                                  onClick={() => setOpen(true)}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  {t('edit')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="hover:cursor-pointer"
                                  disabled={isFetching}
                                  onClick={() => handleDeleteMessages(conversation.id)}
                                >
                                  <GrClearOption className="h-4 w-4 mr-2" />
                                  {t('clear')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="hover:cursor-pointer text-red-500"
                                  disabled={isFetching || conversations.length === 1}
                                  onClick={() => handleRemoveConversation(conversation.id)}
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
    </>
  );
};
