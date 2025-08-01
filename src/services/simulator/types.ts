export interface SimulatorData {
  cashValue: number;
  installmentValue: number;
  numberOfInstallments: number;
  annualSelicRatePercent: number;
}

export interface SimulatorResponse {
  result: string;
  cashOption: string;
  installmentOption: string;
  note: string;
}
