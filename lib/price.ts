export const roundToNearestFive = (num: number) => {
  const integerPart = Math.floor(num);
  const decimalPart = num - integerPart;

  const decimalPartInHundredths = Math.round(decimalPart * 100);

  const roundedDecimal = Math.round(decimalPartInHundredths / 5) * 5;

  return parseFloat((integerPart + roundedDecimal / 100).toFixed(2));
};
