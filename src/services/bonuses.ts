import { isEmpty } from 'lodash';

import { Logger, StandardDTO, StandardRes, Bonus } from '@src/types';

/**
 * Process employee bonueses.
 * Pass in the bonuses after they have been fetched from db
 * @param {StandardDTO} payload StandardDTO - { organization, employee, proRateMonth, meta: { bonuses } }
 * @returns [organization, employee, proRateMonth, log]
 */
export const processBonuses = (payload: StandardDTO): StandardRes => {
  const log: Logger = { events: [{ msg: '' }] };
  const { organization, employee, proRateMonth, meta } = payload;
  let { bonuses } = meta;

  if (isEmpty(bonuses)) return [organization, employee, proRateMonth, log];

  employee.loan_deductions = [];
  employee.total_loan_deduction = 0;
  employee.loan_disbursements = [];
  employee.total_loan_disbursement = 0;

  const quickBonus = (<Bonus[]>bonuses).find(
    b => b.mode === 'quick' && b.type === 'once'
  );

  if (organization.enabledSheetMode && !isEmpty(quickBonus))
    bonuses = [<Bonus>quickBonus];
  
  employee.bonuses = (<Bonus[]>bonuses).map(bonus => ({
    id: bonus.id,
    type: bonus.type,
    amount: bonus.amount,
    endDate: bonus.endDate,
    description: bonus.name
  }));

  employee.total_bonus = (<Bonus[]>bonuses).reduce(
    (acc, bonus) => acc + bonus.amount,
    0
  );

  const base = employee.base_payable || employee.base_salary;
  const allowance = employee.allowance_payable || 0;
  const allowancePayable = allowance + employee.total_bonus;

  // allowance_payable holds the combination of monies that are not
  // normal salary i.e. bonus, deductions
  employee.allowance_payable = allowancePayable;
  employee.net_income = base + employee.allowance_payable;

  return [organization, employee, proRateMonth, log];
};
