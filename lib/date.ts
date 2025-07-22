import { addSeconds, Duration, formatDuration, intervalToDuration } from 'date-fns';

const durationFormat: (keyof Duration)[] = ['months', 'weeks', 'days', 'hours', 'minutes'];

export const roundDate = (date: Date) => {
  date.setHours(0);
  date.setMinutes(0, 0, 0);
  date.setSeconds(0);

  return addSeconds(date, date.getTimezoneOffset() * -1 * 60);
};

export const formatTimeInSeconds = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  const formattedDuration = formatDuration(duration, {
    format: seconds < 60 ? [...durationFormat, 'seconds' as keyof Duration] : durationFormat,
  });

  return formattedDuration ?? '0 minutes';
};

export const getTimeGreeting = () => {
  const currentTime = new Date().getHours();

  if (currentTime >= 5 && currentTime < 12) {
    return 'morning';
  }

  if (currentTime >= 12 && currentTime < 18) {
    return 'afternoon';
  }

  return 'evening';
};
