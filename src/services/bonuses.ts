import { isEmpty } from 'lodash';

import { Logger, StandardDTO, StandardRes, Bonus, Employee } from '@src/types';

/**
 * Process employee bonuses. 
 * Pass in the bonuses after they have been fetched from db
 * @param {StandardDTO} payload StandardDTO - { organization, employee, proRateMonth, meta: { bonuses } }
 * @returns [organization, employee, proRateMonth, log]
 */
export const processBonuses = (payload: StandardDTO): StandardRes => {
  const log: Logger = { events: [{ msg: '' }] };
  const { organization, employee, proRateMonth, meta } = payload;
  let { bonuses } = meta;

  if (isEmpty(bonuses)) return [organization, employee, proRateMonth, log];

  const quickBonus = (<Bonus[]>bonuses).find(
    b => b.mode === 'quick' && b.type === 'once'
  );

  if (organization.enabledSheetMode && !isEmpty(quickBonus))
    bonuses = [<Bonus>quickBonus];

  employee.total_bonus = 0;

  employee.bonuses = (<Bonus[]>bonuses).map(bonus => {
    employee.total_bonus += bonus.amount;

    return {
      id: bonus.id,
      type: bonus.type,
      amount: bonus.amount,
      endDate: bonus.endDate,
      description: bonus.name
    }
  });

  calculateSalary(employee, employee.total_bonus);

  return [organization, employee, proRateMonth, log];
};

export const processUntaxedBonuses = (payload: StandardDTO): StandardRes => {
  const log: Logger = { events: [{ msg: '' }] };
  const { organization, employee, proRateMonth, meta } = payload;
  let { untaxed_bonuses } = meta;

  if (isEmpty(untaxed_bonuses)) return [organization, employee, proRateMonth, log];

  employee.total_untaxed_bonus = 0;

  employee.untaxed_bonuses = (<Bonus[]>untaxed_bonuses).map(bonus => {
    employee.total_untaxed_bonus += bonus.amount;

    return {
      id: bonus.id,
      type: bonus.type,
      amount: bonus.amount,
      description: bonus.name
    };
  });

  calculateSalary(employee, employee.total_untaxed_bonus)

  return [organization, employee, proRateMonth, log];
};

export const calculateSalary = (employee: Employee, addition: number) => {
  const base = employee.base_payable || employee.base_salary;
  const allowance = employee.allowance_payable || 0;
  const allowancePayable = allowance + addition;

  // allowance_payable holds the combination of monies that are not
  // normal salary i.e. bonus, deductions
  employee.allowance_payable = allowancePayable;
  employee.net_income = base + employee.allowance_payable;
}
