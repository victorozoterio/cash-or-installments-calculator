import { moneyMask, typingMoneyMask, moneyToNumberMask, percentageToNumberMask, typingPercentageMask } from './money';

export const mask = {
  money: moneyMask,
  typingMoney: typingMoneyMask,
  moneyToNumber: moneyToNumberMask,
  percentageToNumber: percentageToNumberMask,
  typingPercentage: typingPercentageMask,
};
