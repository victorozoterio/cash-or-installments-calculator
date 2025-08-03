import { z } from 'zod';

export const simulatorSchema = z.object({
  cashValue: z.number().min(0.01, 'Campo obrigatório'),
  installmentValue: z.number().min(0.01, 'Campo obrigatório'),
  numberOfInstallments: z.number().min(1, 'Campo obrigatório').max(24, 'O máximo de parcelas permitido é 24'),
  annualSelicRatePercent: z.number().min(0.01, 'Campo obrigatório'),
});

export type SimulatorFormData = z.infer<typeof simulatorSchema>;
