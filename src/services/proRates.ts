import * as moment from 'moment';

import { Log, StandardDTO } from '@/types';

/**
 * Pass in the proRates after they have been fetched from db
 * @param payload - { organization, employee, proRates, meta: { paidDays, proRateMonth } }
 * @param log Log
 * @returns 
 */
export const processProRates = (payload: StandardDTO, log: Log) => {
  const { organization, employee, proRates, meta } = payload;
  const { paidDays, proRateMonth } = meta;

  if (!proRateMonth) return [organization, employee, proRateMonth, log];

  const payrollDays = getNumberOfWeekdaysInMonth(proRateMonth);

  log.events.push({
    msg: `Number of working days in ${proRateMonth} is ${payrollDays}`,
  });

  if (!employee.application) {
    log.events.push({
      msg: `Employee with id: ${employee.id} application not found, please check, ProcessProRates`,
    });
    return [organization, employee, proRateMonth, log];
  }

  log.events.push({ msg: `Starting ${employee.application.firstname}` });

  log.events.push({
    msg: `${employee.application.firstname} has ${paidDays}`,
  });
  const base = employee.base_payable || employee.base_salary;
  const proRatedSalary = (base / payrollDays) * (paidDays as number);
  const proRateDeduction = base - proRatedSalary;

  log.events.push({
    msg: `${employee.application.firstname} - ${base} | ${proRatedSalary} | ${proRateDeduction}`,
  });

  employee.pro_rates = proRates;
  employee.pro_rate_deduction = (paidDays as number) > 0 ? proRateDeduction : 0;

  employee.base_payable = (paidDays as number) > 0 ? proRatedSalary : base;

  log.events.push({
    msg: `${employee.application.firstname} has pro rate deduction ${proRateDeduction}`,
  });

  return [organization, employee, proRateMonth, log];
};

export const getNumberOfWeekdaysInMonth = (proRateMonth: string) => {
  const monthStart = moment()
    .month(proRateMonth as string)
    .startOf('month')
    .add(1, 'hour');
  const monthEnd = moment()
    .month(proRateMonth as string)
    .endOf('month')
    .add(1, 'hour');

  return calculateWeekDays(monthStart, monthEnd);
};

export const calculateWeekDays = (startDate: moment.Moment, endDate: moment.Moment) => {
  const totalDays = endDate.diff(startDate, 'days') + 1;
  // let startDay = startDate.day();
  // let count = 0;

  // for (let i = 0; i < totalDays; i += 1) {
  //   if (startDay > 0 && startDay < 6) count += 1;
  //   startDay += 1;
  //   if (startDay > 6) startDay = 0;
  // }
  return totalDays;
};
