import { addSeconds } from 'date-fns';

export const roundDate = (date: Date) => {
  date.setHours(0);
  date.setMinutes(0, 0, 0);
  date.setSeconds(0);

  return addSeconds(date, date.getTimezoneOffset() * -1 * 60);
};
