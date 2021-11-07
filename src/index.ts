import { Intents, IntentServices } from '@src/types';
import { processProRates, getNumberOfWeekdaysInMonth, calculateWeekDays } from '@services/proRates';
import { processLoans, processCDBLoans } from '@services/loans';
import { UnifiedPayroll } from '@services/payroll';
import { processBonuses, processUntaxedBonuses, processExtraMonth, calculateSalary, processLeaveAllowance } from '@services/bonuses';

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

/**
 * export main functions
 */
export { processProRates, processLoans, processBonuses, processUntaxedBonuses,
  processExtraMonth, processLeaveAllowance, processCDBLoans
};

/**
 * export helper functions
 */
export { getNumberOfWeekdaysInMonth, calculateWeekDays, calculateSalary };
