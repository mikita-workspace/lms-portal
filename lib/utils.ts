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

export const hasJsonStructure = (str: string) => {
  if (typeof str !== 'string') return false;

  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
};
