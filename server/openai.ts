import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN,
  organization: process.env.OPEN_AI_ORG,
});
