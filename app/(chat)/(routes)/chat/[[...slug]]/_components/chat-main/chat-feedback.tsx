'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { SyntheticEvent, useState } from 'react';

import { cn } from '@/lib/utils';

const enum Feedback {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

type ChatFeedback = {
  className?: string;
  disabled?: boolean;
  id?: string;
};

export const ChatFeedback = ({ className, disabled }: ChatFeedback) => {
  const [clicked, setClicked] = useState({
    [Feedback.POSITIVE]: false,
    [Feedback.NEGATIVE]: false,
  });

  const handleClick = (event: SyntheticEvent & { currentTarget: { name: string } }) => {
    const action = event.currentTarget.name;

    setClicked((prev) => ({ ...prev, [action]: true }));

    //TODO: Logic of feedback

    setTimeout(() => {
      setClicked((prev) => ({ ...prev, [action]: false }));
    }, 1000);
  };

  return (
    <div className="flex gap-x-3">
      <button onClick={handleClick} disabled={disabled} name={Feedback.POSITIVE}>
        <ThumbsUp
          className={cn(
            'h-4 w-4',
            clicked[Feedback.POSITIVE] ? 'animate-spin-once' : '',
            className,
          )}
        />
      </button>
      <button onClick={handleClick} disabled={disabled} name={Feedback.NEGATIVE}>
        <ThumbsDown
          className={cn(
            'h-4 w-4',
            clicked[Feedback.NEGATIVE] ? 'animate-spin-once' : '',
            className,
          )}
        />
      </button>
    </div>
  );
};
