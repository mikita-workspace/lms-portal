import { getRandomInt } from './utils';

export const generatePromotionCode = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let promotionCode = '';

  for (let i = 0; i < length; i += 1) {
    const randomIndex = getRandomInt(0, characters.length - 1);
    promotionCode += characters[randomIndex];
  }

  return promotionCode;
};
