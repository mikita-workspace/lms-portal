import { type ClassValue, clsx } from 'clsx';
import { AES, enc } from 'crypto-js';
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

export function getRandomInt(min: number, max: number) {
  const byteArray = new Uint8Array(1);
  crypto.getRandomValues(byteArray);

  const range = max - min + 1;
  const max_range = 256;

  if (byteArray[0] >= Math.floor(max_range / range) * range) {
    return getRandomInt(min, max);
  }

  return min + (byteArray[0] % range);
}

export const encrypt = <T>(value: T, secret: string) => {
  const cipher = AES.encrypt(JSON.stringify(value), secret).toString();

  return cipher;
};

export const decrypt = (cipher: string, secret: string) => {
  const bytes = AES.decrypt(cipher, secret);

  return bytes.toString(enc.Utf8);
};

export const absoluteUrl = (path: string) => `${process.env.NEXT_PUBLIC_APP_URL}${path}`;

export const isValidUrl = (value: string) => {
  try {
    new URL(value);

    return true;
  } catch (_) {
    return false;
  }
};

export const splitIntoWords = (sentence: string) => {
  const cleanSentence = sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();

  return cleanSentence.split(/\s+/);
};
