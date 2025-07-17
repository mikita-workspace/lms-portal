import { addSeconds, formatDuration, intervalToDuration } from 'date-fns';

export const roundDate = (date: Date) => {
  date.setHours(0);
  date.setMinutes(0, 0, 0);
  date.setSeconds(0);

  return addSeconds(date, date.getTimezoneOffset() * -1 * 60);
};

export const formatTimeInSeconds = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  const formattedDuration = formatDuration(duration, {
    format: ['months', 'weeks', 'days', 'hours', 'minutes'],
  });

  return formattedDuration ?? '0 minutes';
};
