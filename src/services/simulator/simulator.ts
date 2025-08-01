import { api } from '../axios';
import * as T from './types';

export const getSimulatorResult = async (data: T.SimulatorData): Promise<T.SimulatorResponse> => {
  try {
    const response = await api.post('', data);

    return {
      result: response.data.result,
      cashOption: response.data.cashOption,
      installmentOption: response.data.installmentOption,
      note: response.data.note,
    };
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error sending data: ${err.message}`);
    }
    throw new Error('Error sending data');
  }
};
