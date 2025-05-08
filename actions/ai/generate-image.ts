'use server';

import { ImageGenerateParams } from 'openai/resources/images.mjs';

import { getCurrentUser } from '../auth/get-current-user';
import { getTargetProvider } from './get-target-provider';

type GenerateImage = Omit<ImageGenerateParams, 'model'> & {
  model?: string;
};

export const generateImage = async ({ model, prompt }: GenerateImage) => {
  const user = await getCurrentUser();

  const { provider, targetImageModel } = await getTargetProvider(model);

  if (!user?.hasSubscription && targetImageModel.isSubscription) {
    return {
      image: null,
      model: targetImageModel.value,
    };
  }

  const response = await provider.images.generate({
    model: targetImageModel.value,
    n: 1,
    prompt,
    quality: 'hd',
    response_format: 'b64_json',
    size: '1024x1024',
  });

  return {
    image: response,
    model: targetImageModel.value,
  };
};
