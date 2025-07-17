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

export const NOVA_PULSE_SUMMARY = <T>(data: T, locale: string) =>
  `Based on this data - ${JSON.stringify(data)}, make a conclusion about my academic performance. Return the response in JSON format - {title: "Short title which describe my result", color: "color which related to title. Available colors for select - green, lime, red, yellow.", body: "Conclusion on academic performance in 2-3 sentences"}. Translate it in ${locale}.`;

export const ChatCompletionRole = {
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user',
};

export const enum AI_PROVIDER {
  deepseek = 'deepseek',
  ollama = 'ollama',
  openai = 'openai',
}

export const LIMIT_REQUESTS_PER_WEEK = 5;
export const enum REQUEST_STATUS {
  ALLOW = 'allow',
  FORBIDDEN = 'forbidden',
}
