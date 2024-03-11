export const roundDate = (date: Date) => {
  date.setHours(0);
  date.setMinutes(0, 0, 0);

  return date;
};
