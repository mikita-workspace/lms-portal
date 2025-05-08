'use server';

import { AIProvider } from '@/server/ai-provider';

import { getAppConfig } from '../configs/get-app-config';

export const getTargetProvider = async (model: string | undefined) => {
  const config = await getAppConfig();

  const targetProvider = config.ai.find((ai) => {
    const allModels = [...ai['image-models'], ...ai['text-models']].map((model) => model.value);

    return allModels.includes(String(model));
  });

  if (!targetProvider) {
    const { provider, 'text-models': textModels, 'image-models': imageModels } = config.ai[0];

    return {
      provider: AIProvider(provider),
      providerName: provider,
      targetImageModel: imageModels[0],
      targetTextModel: textModels[0],
    };
  }

  const { provider, 'text-models': textModels, 'image-models': imageModels } = targetProvider;

  const targetTextModel =
    textModels.find((textModel) => textModel.value === model) ?? textModels[0];
  const targetImageModel =
    imageModels.find((imageModel) => imageModel.value === model) ?? imageModels[0];

  return {
    provider: AIProvider(provider),
    providerName: provider,
    targetImageModel,
    targetTextModel,
  };
};
