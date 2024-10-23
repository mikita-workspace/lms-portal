'use client';

import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Chapter } from '@prisma/client';
import { GripVertical, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

import { TextBadge } from '@/components/common/text-badge';
import { useHydration } from '@/hooks/use-hydration';
import { cn } from '@/lib/utils';

type ChaptersListProps = {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReorder: (updatedData: { id: string; position: number }[]) => void;
};

export const ChaptersList = ({ items, onEdit, onReorder }: ChaptersListProps) => {
  const [chapters, setChapters] = useState(items);

  const { isMounted } = useHydration();

  useEffect(() => {
    setChapters(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

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
                      {chapter.isFree && <TextBadge variant="lime" label="Free" />}
                      <TextBadge
                        variant={chapter.isPublished ? 'yellow' : 'default'}
                        label={chapter.isPublished ? 'Published' : 'Draft'}
                      />
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
