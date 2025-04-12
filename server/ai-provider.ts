import OpenAI from 'openai';

import { AI_PROVIDER } from '@/constants/ai';

const deepSeekOptions = {
  apiKey: process.env.DEEP_SEEK_TOKEN,
  baseURL: 'https://api.deepseek.com',
};

const ollamaOptions = {
  api_key: 'ollama',
  base_url: process.env.OLLAMA_BASE_URL,
};

const openaiOptions = {
  apiKey: process.env.OPEN_AI_TOKEN,
};

export const AIProvider = (provider: string) => {
  let options = {};

  switch (provider) {
    case AI_PROVIDER.deepseek:
      options = deepSeekOptions;
      break;
    case AI_PROVIDER.openai:
      options = openaiOptions;
      break;
    default:
      options = ollamaOptions;
  }

  return new OpenAI(options);
};
