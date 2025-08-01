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
        <fieldset className='simulator'>
          <legend>À vista ou parcelado?</legend>

          <div className='container grid'>
            <div className='input-wrapper'>
              <label htmlFor='installment-value'>Valor da parcela</label>
              <input
                type='number'
                id='installment-value'
                value={installmentValue}
                onChange={(e) => setInstallmentValue(Number(e.target.value))}
                placeholder='00,00'
                required
              />
            </div>

            <div className='input-wrapper'>
              <label htmlFor='number-of-installments'>Quant. de parcelas</label>
              <input
                type='number'
                id='number-of-installments'
                value={numberOfInstallments}
                onChange={(e) => setNumberOfInstallments(Number(e.target.value))}
                placeholder='0'
                required
              />
            </div>

            <div className='input-wrapper'>
              <label htmlFor='cash-value'>Valor à vista</label>
              <input
                type='number'
                id='cash-value'
                value={cashValue}
                onChange={(e) => setCashValue(Number(e.target.value))}
                placeholder='00,00'
                required
              />
            </div>

            <div className='input-wrapper'>
              <label htmlFor='annual-selic-rate'>Taxa de juros anual</label>
              <input
                type='number'
                id='annual-selic-rate'
                value={annualSelicRatePercent}
                onChange={(e) => setAnnualSelicRatePercent(e.target.value)}
                placeholder='00,00'
                required
              />
            </div>

            <button type='submit'>Simular</button>

            {resultData && (
              <>
                <div id='result-container' style={{ display: 'block' }}>
                  {resultData.result}
                </div>
                <div id='cash-option-container' style={{ display: 'block' }}>
                  {resultData.cashOption}
                </div>
                <div id='installment-option-container' style={{ display: 'block' }}>
                  {resultData.installmentOption}
                </div>
                <div id='note-container' style={{ display: 'block' }}>
                  {resultData.note}
                </div>
              </>
            )}

            {error && (
              <div id='result-container' style={{ display: 'grid' }}>
                <strong>{error}</strong>
              </div>
            )}
          </div>
        </fieldset>
      </form>
    </main>
  );
}
