'use client';

import { format } from 'date-fns';

import { TIMESTAMP_TEMPLATE } from '@/constants/common';

type DateColumnProps = {
  date: Date | number;
};

export const DateColumn = ({ date }: DateColumnProps) => {
  return <span>{format(date, TIMESTAMP_TEMPLATE)}</span>;
};
