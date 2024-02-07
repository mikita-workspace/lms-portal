'use client';

import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Chapter } from '@prisma/client';
import { Grip, Pencil } from 'lucide-react';
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
                    className={cn(
                      'flex items-center gap-x-2 bg-neutral-200 border-neutral-200 border text-neutral-700 rounded-md mb-4 text-sm dark:bg-muted dark:text-primary dark:border-muted',
                      chapter.isPublished && 'bg-sky-100 border-sky-200 text-sky-700',
                    )}
                    ref={innerProvided.innerRef}
                  >
                    <div
                      {...innerProvided.dragHandleProps}
                      className={cn(
                        'px-2 py-3 border-r border-r-neutral-200 hover:bg-neutral-300  rounded-l-md transition duration-300 dark:border-r-muted dark:hover:bg-neutral-900',
                        chapter.isPublished && 'border-r-sky-200 hover:bg-sky-200',
                      )}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && (
                        <Badge
                          className="bg-green-600/30 text-green-800 dark:text-neutral-100 border-none"
                          variant="outline"
                        >
                          Free
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          'bg-neutral-600/30 text-neutral-800 dark:text-neutral-100 border-none',
                          chapter.isPublished && 'bg-violet-700 text-neutral-100',
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
