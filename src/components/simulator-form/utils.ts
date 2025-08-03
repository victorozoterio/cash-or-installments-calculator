import { FieldValues, Path, UseFormSetValue } from 'react-hook-form';
import { mask } from '../../utils';

export enum MaskType {
  MONEY = 'money',
  PERCENTAGE = 'percentage',
  INSTALLMENTS = 'installments',
}

export function handleMaskedInput<T extends FieldValues>(
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: UseFormSetValue<T>,
  fieldName: Path<T>,
  maskType: MaskType,
): void {
  let raw = e.target.value || '';

  switch (maskType) {
    case MaskType.MONEY: {
      raw = raw.replace(/\D/g, '').slice(0, 15);
      const masked = mask.typingMoney(raw);
      e.target.value = masked;
      setValue(fieldName, mask.moneyToNumber(masked) as unknown as T[Path<T>], {
        shouldValidate: true,
      });
      break;
    }

    case MaskType.PERCENTAGE: {
      raw = raw.replace(/[^0-9]/g, '').slice(0, 4);
      const masked = mask.typingPercentage(raw);
      e.target.value = masked;
      setValue(fieldName, mask.percentageToNumber(masked) as unknown as T[Path<T>], {
        shouldValidate: true,
      });
      break;
    }

    case MaskType.INSTALLMENTS: {
      raw = raw.replace(/\D/g, '').slice(0, 2);
      const num = Math.min(24, parseInt(raw || '0', 10));
      e.target.value = num ? num.toString() : '';
      setValue(fieldName, num as unknown as T[Path<T>], { shouldValidate: true });
      break;
    }
  }
}

export function formatPercentageForDisplay(value?: number): string {
  if (value === undefined || value === null) return '';
  return mask.typingPercentage(String(value * 100));
}
