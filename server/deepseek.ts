import OpenAI from 'openai';

export const deepSeek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEP_SEEK_TOKEN,
});
