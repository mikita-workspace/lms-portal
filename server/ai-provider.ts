import OpenAI from 'openai';

import { AI_PROVIDER } from '@/constants/ai';

export const AIProvider = (provider: string) => {
  let options = {};

  switch (provider) {
    case AI_PROVIDER.deepseek:
      options = {
        apiKey: process.env.DEEP_SEEK_TOKEN,
        baseURL: 'https://api.deepseek.com',
      };
      break;
    case AI_PROVIDER.openai:
      options = {
        apiKey: process.env.OPEN_AI_TOKEN,
      };
      break;
    default:
      options = {
        apiKey: 'ollama',
        baseURL: process.env.OLLAMA_BASE_URL,
      };
  }

  return new OpenAI(options);
};
