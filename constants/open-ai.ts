export const ChatCompletionRole = {
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user',
};

export const models = [
  { value: 'gpt-4-0125-preview', label: 'GPT-4 Turbo 0125' },
  { value: 'gpt-4-1106-preview', label: 'GPT-4 Turbo 1106' },
  { value: 'gpt-3.5-turbo-0125', label: 'GPT-3.5 Turbo 0125' },
  { value: 'gpt-3.5-turbo-1106', label: 'GPT-3.5 Turbo 1106' },
];

export const DEFAULT_MODEL = 'gpt-4-1125-preview';
