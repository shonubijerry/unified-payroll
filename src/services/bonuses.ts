import { isEmpty } from 'lodash';

import { Logger, StandardDTO, StandardRes, Bonus, Employee } from '@src/types';

/**
 * Process employee bonuses.
 * Pass in the bonuses after they have been fetched from db
 * @param {StandardDTO} payload StandardDTO - { organization, employee, proRateMonth, meta: { bonuses } }
 * @returns [organization, employee, proRateMonth, { log }]
 */
export const processBonuses = (payload: StandardDTO): StandardRes => {
  const log: Logger = { events: [{ msg: '' }] };
  const { organization, employee, proRateMonth, meta } = payload;
  let { bonuses } = meta;

  if (isEmpty(bonuses)) return [organization, employee, proRateMonth, { log }];

  const quickBonus = (<Bonus[]>bonuses).find((b) => b.mode === 'quick' && b.type === 'once');

  if (organization.enabledSheetMode && !isEmpty(quickBonus)) bonuses = [<Bonus>quickBonus];

  employee.total_bonus = 0;

  employee.bonuses = (<Bonus[]>bonuses).map((bonus) => {
    employee.total_bonus += bonus.amount;

    return {
      id: bonus.id,
      type: bonus.type,
      amount: bonus.amount,
      endDate: bonus.endDate,
      description: bonus.name,
    };
  });

  calculateSalary(employee, employee.total_bonus);

  return [organization, employee, proRateMonth, { log }];
};

/**
 * Process employee untaxed bonuses.
 * Pass in the bonuses after they have been fetched from db
 * @param {StandardDTO} payload StandardDTO - { organization, employee, proRateMonth, meta: { untaxedBonuses } }
 * @returns [organization, employee, proRateMonth, { log }]
 */
export const processUntaxedBonuses = (payload: StandardDTO): StandardRes => {
  const log: Logger = { events: [{ msg: '' }] };
  const { organization, employee, proRateMonth, meta } = payload;
  const { untaxedBonuses } = meta;

  if (isEmpty(untaxedBonuses)) return [organization, employee, proRateMonth, { log }];

  employee.total_untaxed_bonus = 0;

  employee.untaxed_bonuses = (<Bonus[]>untaxedBonuses).map((bonus) => {
    employee.total_untaxed_bonus += bonus.amount;

    return {
      id: bonus.id,
      type: bonus.type,
      amount: bonus.amount,
      description: bonus.name,
    };
  });

  calculateSalary(employee, employee.total_untaxed_bonus);

  return [organization, employee, proRateMonth, { log }];
};

/**
 * Process employee extra month bonus.
 * Pass in the bonuses after they have been fetched from db
 * @param {StandardDTO} payload StandardDTO - { organization, employee, proRateMonth, meta: { extraMonth } }
 * @returns [organization, employee, proRateMonth, { log, extraMonthToCreate, updateExtraMonth }]
 * @BackendNote inspect the returned object, if extraMonthToCreate is defined,
 * created it in db and add the new record in employee.extraMonth = { id, type, amount, description }
 * @BackendNote save the {extraMonth} passed into meta to keep in sync with employee.extra_month_salary
 */
export const processExtraMonth = (payload: StandardDTO): StandardRes => {
  const log: Logger = { events: [{ msg: '' }] };
  const { organization, employee, proRateMonth, meta } = payload;
  const { extraMonth } = meta;

  if (!organization.enabledExtraMonth || proRateMonth !== organization.extraMonth)
    return [organization, employee, proRateMonth, { log }];

  employee.extra_month_salary = employee.salary * (organization.extraMonthPercentage / 100);

  let extraMonthToCreate: Partial<Bonus> = {};
  let updateExtraMonth = false;

  if (!extraMonth) {
    extraMonthToCreate = {
      type: 'once',
      amount: employee.extra_month_salary,
      name: 'Extra Month',
      employee: employee.id,
      organization: organization.id,
      mode: 'extra-month',
    };
    // create extramonth after this function returns data, and update employee.extraMonth with new record
  } else {
    employee.extraMonth = {
      id: extraMonth.id,
      type: extraMonth.type,
      amount: extraMonth.amount,
      description: extraMonth.name,
    };
    // check if extraMonth.amount is not same as employee.extra_month_salary, update it and save
    if (employee.extra_month_salary !== extraMonth.amount) {
      extraMonth.amount = employee.extra_month_salary;
      updateExtraMonth = true;
    }
  }

  calculateSalary(employee, employee.extra_month_salary);

  return [organization, employee, proRateMonth, { log, extraMonthToCreate, updateExtraMonth }];
};

/**
 * Process employee leave allowance.
 * Pass in the bonuses after they have been fetched from db
 * @param {StandardDTO} payload StandardDTO - { organization, employee, proRateMonth, meta: { leaveAllowances } }
 * @returns [organization, employee, proRateMonth, { log }]
 */
export const processLeaveAllowance = (payload: StandardDTO): StandardRes => {
  const log: Logger = { events: [{ msg: '' }] };
  const { organization, employee, proRateMonth, meta } = payload;
  const { leaveAllowances } = meta;

  if (!organization.enabledLeaveAllowance || isEmpty(leaveAllowances))
    return [organization, employee, proRateMonth, { log }];

  employee.total_leave_allowance = 0;

  employee.leave_allowances = (<Bonus[]>leaveAllowances).map((bonus) => {
    employee.total_leave_allowance += bonus.amount;

    return {
      id: bonus.id,
      type: bonus.type,
      amount: bonus.amount,
      description: bonus.name,
    };
  });

  calculateSalary(employee, employee.total_leave_allowance);

  return [organization, employee, proRateMonth, { log }];
};

/**
 * Calculate and add a bunus item to employee net income
 * @param {Employee} employee
 * @param {number} addition
 */
export const calculateSalary = (employee: Employee, addition: number) => {
  const base = employee.base_payable || employee.base_salary;
  const allowance = employee.allowance_payable || 0;
  const allowancePayable = allowance + addition;

  // allowance_payable holds the combination of monies that are not
  // normal salary i.e. bonus, deductions
  employee.allowance_payable = allowancePayable;
  employee.net_income = base + employee.allowance_payable;
};
