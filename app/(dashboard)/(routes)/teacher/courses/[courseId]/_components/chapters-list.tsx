'use client';

import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Chapter } from '@prisma/client';
import { GripVertical, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

type ChaptersListProps = {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReorder: (updatedData: { id: string; position: number }[]) => void;
};

export const ChaptersList = ({ items, onEdit, onReorder }: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const copyChapters = Array.from(chapters);
    const [reorderedItem] = copyChapters.splice(result.source.index, 1);
    copyChapters.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = copyChapters.slice(startIndex, endIndex + 1);

    setChapters(copyChapters);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: copyChapters.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                {(innerProvided) => (
                  <div
                    {...innerProvided.draggableProps}
                    // bg-blue-500/15 border border-blue-500/20 text-blue-700 dark:text-blue-400
                    className={cn(
                      'flex items-center gap-x-2 bg-neutral-200 border-neutral-200 border text-neutral-700 rounded-md mb-4 text-sm dark:bg-muted dark:text-primary dark:border-muted',
                      chapter.isPublished &&
                        'bg-blue-500/15 border-blue-500/20 text-blue-700 dark:text-blue-400 dark:bg-blue-500/15 dark:border-blue-500/20',
                    )}
                    ref={innerProvided.innerRef}
                  >
                    <div
                      {...innerProvided.dragHandleProps}
                      className={cn(
                        'px-2 py-3 border-r border-r-neutral-200 hover:bg-neutral-300  rounded-l-md transition duration-300 dark:border-r-muted dark:hover:bg-neutral-900/50',
                        chapter.isPublished &&
                          'border-r-blue-500/20 hover:bg-blue-500/15 dark:hover:bg-blue-500/15 dark:border-blue-500/20',
                      )}
                    >
                      <GripVertical className="h-5 w-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && (
                        <Badge
                          className="bg-lime-400/20 text-lime-700 dark:bg-lime-400/10 dark:text-lime-300 border-none"
                          variant="outline"
                        >
                          Free
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300 border-none',
                          chapter.isPublished &&
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-300',
                        )}
                        variant="outline"
                      >
                        {chapter.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Pencil
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition duration-300"
                        onClick={() => onEdit(chapter.id)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
