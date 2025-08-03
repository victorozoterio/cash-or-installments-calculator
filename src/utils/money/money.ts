export const moneyMask = (value?: number): string => {
  if (!value) return 'R$ 0,00';
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const typingMoneyMask = (value?: string): string => {
  if (!value) return '0,00';

  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '0,00';

  const formattedValue = (Number(numericValue) / 100).toFixed(2);
  return formattedValue.replace('.', ',');
};

export const moneyToNumberMask = (maskedValue?: string): number => {
  if (!maskedValue) return 0;
  const numericValue = maskedValue.replace(/[^0-9]/g, '');
  return numericValue ? Number.parseFloat(numericValue) / 100 : 0;
};

export const typingPercentageMask = (value?: string): string => {
  if (!value) return '';
  const numericValue = value.replace(/[^0-9,]/g, '');
  const numberValue = Number(numericValue) / 100;
  return numberValue.toFixed(2).replace('.', ',');
};

export const percentageToNumberMask = (maskedValue?: string): number => {
  if (!maskedValue) return 0;
  const numericValue = maskedValue.replace(/,([^,]*)$/, '.$1');
  return numericValue ? Number.parseFloat(numericValue) : 0;
};
