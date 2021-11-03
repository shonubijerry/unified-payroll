import { Intents, IntentServices } from '@/types';
import { processProRates } from '@services/proRates';
import { UnifiedPayroll } from '@services/payroll';

export const Greeter = (name: string) => `Hello ${name}`;

/**
 * This method is deprecated
 * @param intent string
 * @returns 
 */
export const unifiedPayroll = (intent: Intents) => {
  const unified = new UnifiedPayroll();
  return unified.getService(intent) as IntentServices;
};

export {
  processProRates
};
