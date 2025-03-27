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
