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

export const ChatCompletionRole = {
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user',
};

export const OPEN_AI_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'o3-mini-2025-01-31', label: 'GPT-o3 mini' },
  { value: 'gpt-4-turbo-2024-04-09', label: 'GPT-4 Turbo' },
  { value: 'gpt-4-0125-preview', label: 'GPT-4 Turbo Preview' },
  { value: 'gpt-3.5-turbo-0125', label: 'GPT-3.5 Turbo' },
];

export const OPEN_AI_IMAGE_MODELS = [{ value: 'dall-e-3', label: 'DALL·E 3' }];

export const DEFAULT_MODEL = OPEN_AI_MODELS[0].value;

export const enum AI_PROVIDER {
  deepseek = 'deepseek',
  ollama = 'ollama',
  openai = 'openai',
}
