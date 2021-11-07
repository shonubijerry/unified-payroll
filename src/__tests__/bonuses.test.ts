import { cloneDeep } from 'lodash';

import { Employee, Meta, Organiztion } from '@src/types';
import { processBonuses, processUntaxedBonuses } from '@src/index';

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
