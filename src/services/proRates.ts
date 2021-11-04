import * as moment from 'moment';

import { Application, Logger, StandardDTO } from '@/types';

/**
 * Pass in the proRates after they have been fetched from db
 * @param payload - { organization, employee, meta: { paidDays, proRateMonth, proRates } }
 * @returns [organization, employee, proRateMonth, log]
 */
export const processProRates = (payload: StandardDTO) => {
  const log: Logger = { events: [ { msg:''} ] };
  const { organization, employee, meta } = payload;
  const { paidDays, proRateMonth, proRates } = meta;

  if (!proRateMonth) return [organization, employee, proRateMonth, log];

  const payrollDays = getNumberOfWeekdaysInMonth(proRateMonth);

  log.events.push({
    msg: `Number of working days in ${proRateMonth} is ${payrollDays}`,
  });

  if (!employee.application) {
    log.events.push({
      msg: `Employee with id: ${employee._id} application not found, please check, ProcessProRates`,
    });
    return [organization, employee, proRateMonth, log];
  }

  const application = <Application>employee.application;

  log.events.push({ msg: `Starting ${application.firstname}` });

  log.events.push({
    msg: `${application.firstname} has ${paidDays}`,
  });
  const base = employee.base_payable || employee.base_salary;
  const proRatedSalary = (base / payrollDays) * (paidDays as number);
  const proRateDeduction = base - proRatedSalary;

  log.events.push({
    msg: `${application.firstname} - ${base} | ${proRatedSalary} | ${proRateDeduction}`,
  });

  employee.pro_rates = proRates as any[];
  employee.pro_rate_deduction = (paidDays as number) > 0 ? proRateDeduction : 0;

  employee.base_payable = (paidDays as number) > 0 ? proRatedSalary : base;

  log.events.push({
    msg: `${application.firstname} has pro rate deduction ${proRateDeduction}`,
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
