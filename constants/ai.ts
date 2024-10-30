import { TEXTAREA_MAX_LENGTH } from './courses';

export const SYSTEM_COURSE_PROMPT =
  'You are the creator of various courses on a special learning platform.';
export const SYSTEM_TRANSLATE_PROMPT = 'You are a translator';

export const USER_COURSE_SHORT_DESCRIPTION_PROMPT = (originalDescription: string) =>
  `Course short description: "${originalDescription}".\nUsing the course description provided above, generate a new one in other words. Maximum output symbols - ${Math.round(TEXTAREA_MAX_LENGTH / 1.4)}`;
export const USER_CHAPTER_DESCRIPTION_PROMPT = (originalDescription: string) =>
  `Chapter description: "${originalDescription}".\nUsing the chapter description provided above, generate a new one in other words. Provide only answer without HTML tags.`;
export const USER_TRANSLATE_PROMPT = (originalText: string, targetLanguage: string) =>
  `You have the following text: "${originalText}". Translate it in ${targetLanguage}. Provide only answer without quotation marks`;
