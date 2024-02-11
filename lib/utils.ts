import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const getFallbackName = (fullName: string) => {
  const [firstname, lastname] = fullName.split(' ');

  return `${capitalize(firstname)[0]}${lastname ? capitalize(lastname)[0] : ''}`;
};
