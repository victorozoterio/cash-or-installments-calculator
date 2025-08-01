import styles from './simulator-form.module.css';
import React, { useEffect, useState } from 'react';
import { getAnnualSelicRatePercent, getSimulatorResult } from '../../services';
import * as T from '../../services/simulator/types';

export default function SimulatorForm() {
  const [cashValue, setCashValue] = useState<number>(0);
  const [installmentValue, setInstallmentValue] = useState<number>(0);
  const [numberOfInstallments, setNumberOfInstallments] = useState<number>(0);
  const [annualSelicRatePercent, setAnnualSelicRatePercent] = useState<number | string>('');
  const [resultData, setResultData] = useState<T.SimulatorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSelicRate = async () => {
      try {
        const rate = await getAnnualSelicRatePercent();
        setAnnualSelicRatePercent(rate);
      } catch (err) {
        console.error('Error fetching Selic rate:', err);
      }
    };

    fetchSelicRate();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data: T.SimulatorData = {
      cashValue,
      installmentValue,
      numberOfInstallments,
      annualSelicRatePercent: typeof annualSelicRatePercent === 'string' ? 0 : annualSelicRatePercent,
    };

    getSimulatorResult(data).then((result) => {
      setResultData(result);
      setError(null);
    });
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <fieldset className={styles.simulator}>
          <h1>À vista ou parcelado?</h1>

          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles['input-wrapper']}>
                <label htmlFor='installment-value'>Valor da parcela</label>
                <div className={styles['input-box']}>
                  <div className={styles.prefix}>R$</div>
                  <input
                    type='number'
                    id='installment-value'
                    value={installmentValue}
                    onChange={(e) => setInstallmentValue(Number(e.target.value))}
                    placeholder='00,00'
                    required
                  />
                </div>
              </div>

              <div className={styles['input-wrapper']}>
                <label htmlFor='number-of-installments'>Quant. de parcelas</label>
                <div className={styles['input-box']}>
                  <input
                    type='number'
                    id='number-of-installments'
                    value={numberOfInstallments}
                    onChange={(e) => setNumberOfInstallments(Number(e.target.value))}
                    placeholder='0'
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles['input-wrapper']}>
                <label htmlFor='cash-value'>Valor à vista</label>
                <div className={styles['input-box']}>
                  <div className={styles.prefix}>R$</div>
                  <input
                    type='number'
                    id='cash-value'
                    value={cashValue}
                    onChange={(e) => setCashValue(Number(e.target.value))}
                    placeholder='00,00'
                    required
                  />
                </div>
              </div>

              <div className={styles['input-wrapper']}>
                <label htmlFor='annual-selic-rate'>Taxa de juros anual</label>
                <div className={styles['input-box']}>
                  <input
                    type='number'
                    id='annual-selic-rate'
                    value={annualSelicRatePercent}
                    onChange={(e) => setAnnualSelicRatePercent(e.target.value)}
                    placeholder='0'
                    required
                  />
                  <div className={styles.suffix}>%</div>
                </div>
              </div>
            </div>

            <button type='submit'>Simular</button>

            {(resultData || error) && (
              <div className={styles['result-container']}>
                {resultData && (
                  <>
                    <strong>{resultData.result}</strong>
                    <div>{resultData.cashOption}</div>
                    <div>{resultData.installmentOption}</div>
                    <div className={styles['note-container']}>{resultData.note}</div>
                  </>
                )}

                {error && <strong>{error}</strong>}
              </div>
            )}
          </div>
        </fieldset>
      </form>
    </main>
  );
}
