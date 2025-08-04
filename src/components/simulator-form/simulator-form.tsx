import styles from './simulator-form.module.css';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simulatorSchema, SimulatorFormData } from './schema';
import { getAnnualSelicRatePercent, getSimulatorResult } from '../../services';
import * as T from '../../services/simulator/types';
import { mask } from '../../utils';
import { formatPercentageForDisplay, handleMaskedInput, MaskType } from './utils';
import { AlertCircle } from 'lucide-react';

export default function SimulatorForm() {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SimulatorFormData>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: {
      cashValue: 0,
      installmentValue: 0,
      numberOfInstallments: 0,
      annualSelicRatePercent: 0,
    },
  });

  const watchCashValue = watch('cashValue');
  const watchInstallmentValue = watch('installmentValue');
  const watchSelic = watch('annualSelicRatePercent');

  const [resultData, setResultData] = React.useState<T.SimulatorResponse | null>(null);

  useEffect(() => {
    const fetchSelicRate = async () => {
      try {
        const rate = await getAnnualSelicRatePercent();
        setValue('annualSelicRatePercent', rate);
      } catch (err) {
        console.error('Erro ao buscar taxa Selic:', err);
        setValue('annualSelicRatePercent', 0);
      }
    };
    fetchSelicRate();
  }, [setValue]);

  const onSubmit = async (data: SimulatorFormData) => {
    const result = await getSimulatorResult(data);
    setResultData(result);
  };

  const disableScroll = (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur();

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className={styles.simulator}>
          <h1>À vista ou parcelado?</h1>

          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles['input-wrapper']}>
                <label htmlFor='installment-value'>Valor da parcela</label>
                <div className={`${styles['input-box']} ${errors.installmentValue ? styles.error : ''}`}>
                  <div className={styles.prefix}>R$</div>
                  <input
                    type='text'
                    id='installment-value'
                    defaultValue={watchInstallmentValue ? mask.money(watchInstallmentValue) : ''}
                    onChange={(e) =>
                      handleMaskedInput<SimulatorFormData>(e, setValue, 'installmentValue', MaskType.MONEY)
                    }
                    placeholder='0,00'
                  />
                </div>
                {errors.installmentValue && (
                  <div className={styles['error-container']}>
                    <AlertCircle size={16} className={styles['error-icon']} />
                    <span>{errors.installmentValue.message}</span>
                  </div>
                )}
              </div>

              <div className={styles['input-wrapper']}>
                <label htmlFor='number-of-installments'>Quant. de parcelas</label>
                <div className={`${styles['input-box']} ${errors.numberOfInstallments ? styles.error : ''}`}>
                  <input
                    type='text'
                    id='number-of-installments'
                    onChange={(e) =>
                      handleMaskedInput<SimulatorFormData>(e, setValue, 'numberOfInstallments', MaskType.INSTALLMENTS)
                    }
                    onWheel={disableScroll}
                    placeholder='1'
                  />
                </div>
                {errors.numberOfInstallments && (
                  <div className={styles['error-container']}>
                    <AlertCircle size={16} className={styles['error-icon']} />
                    <span>{errors.numberOfInstallments.message}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles['input-wrapper']}>
                <label htmlFor='cash-value'>Valor à vista</label>
                <div className={`${styles['input-box']} ${errors.cashValue ? styles.error : ''}`}>
                  <div className={styles.prefix}>R$</div>
                  <input
                    type='text'
                    id='cash-value'
                    defaultValue={watchCashValue ? mask.money(watchCashValue) : ''}
                    onChange={(e) => handleMaskedInput<SimulatorFormData>(e, setValue, 'cashValue', MaskType.MONEY)}
                    placeholder='0,00'
                  />
                </div>
                {errors.cashValue && (
                  <div className={styles['error-container']}>
                    <AlertCircle size={16} className={styles['error-icon']} />
                    <span>{errors.cashValue.message}</span>
                  </div>
                )}
              </div>

              <div className={styles['input-wrapper']}>
                <label htmlFor='annual-selic-rate'>Taxa de juros anual</label>
                <div className={`${styles['input-box']} ${errors.annualSelicRatePercent ? styles.error : ''}`}>
                  <input
                    type='text'
                    id='annual-selic-rate'
                    value={formatPercentageForDisplay(watchSelic)}
                    onChange={(e) =>
                      handleMaskedInput<SimulatorFormData>(e, setValue, 'annualSelicRatePercent', MaskType.PERCENTAGE)
                    }
                    placeholder='0,00'
                  />

                  <div className={styles.suffix}>%</div>
                </div>
                {errors.annualSelicRatePercent && (
                  <div className={styles['error-container']}>
                    <AlertCircle size={16} className={styles['error-icon']} />
                    <span>{errors.annualSelicRatePercent.message}</span>
                  </div>
                )}
              </div>
            </div>

            <button type='submit'>Simular</button>

            {resultData && (
              <div className={styles['result-container']}>
                <strong>{resultData.result}</strong>
                <div>{resultData.cashOption}</div>
                <div>{resultData.installmentOption}</div>
                <div className={styles['note-container']}>{resultData.note}</div>
              </div>
            )}
          </div>
        </fieldset>
      </form>
    </main>
  );
}
