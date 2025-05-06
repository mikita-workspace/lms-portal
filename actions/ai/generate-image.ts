'use server';

import { ImageGenerateParams } from 'openai/resources/images.mjs';

import { AIProvider } from '@/server/ai-provider';

import { getAppConfig } from '../configs/get-app-config';

type GenerateImage = Omit<ImageGenerateParams, 'model'> & {
  model?: string;
};

export const generateImage = async ({ model, prompt }: GenerateImage) => {
  const config = await getAppConfig();

  const aiModel = model || config?.ai?.['image-models']?.[0].value || '';
  const provider = AIProvider(config?.ai?.provider);

  const IMAGE_MODELS = config?.ai?.['image-models'] ?? [];
  const models = IMAGE_MODELS.map(({ value }) => value);

  if (!models.includes(aiModel)) {
    return {
      image: null,
      model: aiModel,
    };
  }

  const response = await provider.images.generate({
    model: aiModel,
    n: 1,
    prompt,
    quality: 'hd',
    response_format: 'b64_json',
    size: '1024x1024',
  });

  return {
    image: response,
    model: null,
  };
};
