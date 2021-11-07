import { cloneDeep, isEmpty } from 'lodash';

import { Employee, Meta, Organiztion, ResMeta } from '@src/types';
import { processBonuses, processUntaxedBonuses, processExtraMonth } from '@src/index';

import * as fixtures from './fixtures/default.json';
import * as bonuses from './fixtures/bonuses.json';

let organization: Organiztion;
let employee: Employee;
const meta: Meta = {};
let entries: any;
const proRateMonth = 'November';

describe('Bonuses (e2e)', () => {
  beforeEach(async () => {
    const fix: any = cloneDeep(fixtures);

    organization = fix.organizations[0];
    employee = fix.employees[0];
    ({ entries } = <any>bonuses);
  });
  test('Should process employee bonuses when organization enabled sheet mode', () => {
    meta.bonuses = entries.case1;
    const res = processBonuses({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];

    expect(emp.bonuses.length).toEqual(1);
    expect(emp.total_bonus).toEqual(100000);
    expect(emp.allowance_payable).toEqual(100000);
    expect(emp.net_income).toEqual(220000);
  });

  test('Should process employee bonuses organization sheet mode is disabled', () => {
    meta.bonuses = entries.case1;
    organization.enabledSheetMode = false;
    const res = processBonuses({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];

    expect(emp.bonuses.length).toEqual(2);
    expect(emp.total_bonus).toEqual(130000);
    expect(emp.allowance_payable).toEqual(130000);
    expect(emp.net_income).toEqual(250000);
  });

  test('Should abort if bonuses is empty or not provided', () => {
    meta.bonuses = [];
    const res = processBonuses({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];

    expect(emp.bonuses).toBeUndefined();
  });
});

describe('Untaxed Bonus (e2e)', () => {
  beforeEach(async () => {
    const fix: any = cloneDeep(fixtures);

    organization = fix.organizations[0];
    employee = fix.employees[0];
    ({ entries } = <any>bonuses);
  });
  test('Should process untaxed bonuses', () => {
    meta.untaxedBonuses = entries.case2;
    const res = processUntaxedBonuses({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];

    expect(emp.untaxed_bonuses.length).toEqual(2);
    expect(emp.total_untaxed_bonus).toEqual(90000);
    expect(emp.allowance_payable).toEqual(90000);
    expect(emp.net_income).toEqual(210000);
  });

  test('Should abort if untaxed bonuses is empty or not provided', () => {
    meta.untaxedBonuses = [];
    const res = processUntaxedBonuses({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];

    expect(emp.untaxed_bonuses).toBeUndefined();
  });
});

describe('Extra Month (e2e)', () => {
  beforeEach(async () => {
    const fix: any = cloneDeep(fixtures);

    organization = fix.organizations[0];
    employee = fix.employees[0];
    ({ entries } = <any>bonuses);
  });
  test('Should process extra month bonus', () => {
    meta.extraMonth = entries.case3;
    const res = processExtraMonth({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];
    const resMeta = <ResMeta>res[3];

    expect(emp.extraMonth).toBeDefined();
    expect(emp.extra_month_salary).toEqual(18000);
    expect(emp.net_income).toEqual(138000);
    expect(isEmpty(resMeta.extraMonthToCreate)).toBe(true);
    expect(resMeta.updateExtraMonth).toEqual(true);
  });

  test('Should process extra month bonus if meta.extraMonth is undefined', () => {
    meta.extraMonth = undefined;
    const res = processExtraMonth({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];
    const resMeta = <ResMeta>res[3];

    expect(emp.extraMonth).toBeUndefined();
    expect(emp.extra_month_salary).toEqual(18000);
    expect(emp.net_income).toEqual(138000);
    expect(resMeta.extraMonthToCreate).toBeDefined();
    expect(resMeta.extraMonthToCreate?.amount).toEqual(18000);
    expect(resMeta.updateExtraMonth).toEqual(false);
  });

  test('Should abort if organization has not enabled extra month', () => {
    meta.extraMonth = entries.case3;
    organization.enabledExtraMonth = false;
    const res = processExtraMonth({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];
    const resMeta = <ResMeta>res[3];

    expect(emp.extraMonth).toBeUndefined();
    expect(emp.extra_month_salary).toBeUndefined();
    expect(resMeta.extraMonthToCreate).toBeUndefined();
    expect(resMeta.updateExtraMonth).toBeUndefined();
  });

  test('Should abort if extra month is not same as proRateMonth', () => {
    meta.extraMonth = entries.case3;
    const res = processExtraMonth({ organization, employee, proRateMonth: 'October', meta });
    const emp = <Employee>res[1];
    const resMeta = <ResMeta>res[3];

    expect(emp.extraMonth).toBeUndefined();
    expect(emp.extra_month_salary).toBeUndefined();
    expect(resMeta.extraMonthToCreate).toBeUndefined();
    expect(resMeta.updateExtraMonth).toBeUndefined();
  });
});
