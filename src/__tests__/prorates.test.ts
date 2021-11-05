import { cloneDeep } from 'lodash';
import { processProRates } from '@/index';

import * as fixtures from './fixtures/default.json';
import * as prorates from './fixtures/prorates.json';
import { Employee, Meta, Organiztion } from '@/types';

let organization: Organiztion;
let employee: Employee;
let meta: Meta;
let entries: any;

describe('ProRates (e2e)', () => {
  beforeEach(async () => {
    const fix: any = cloneDeep(fixtures);

    organization = fix.organizations[0];
    employee = fix.employees[0];
    ({ entries, meta } = <any>prorates);
  });
  test('Should prorate employee 1 day salary', () => {
    meta.proRates = entries.case1;
    const res = processProRates({ organization, employee, proRateMonth: 'November', meta: { ...meta, paidDays: 1 } });
    const emp = <Employee>res[1];

    expect(emp.pro_rates).toBeDefined();
    expect(emp.pro_rates.length).toEqual(1);
    expect(emp.pro_rate_deduction).toEqual(116000);
    expect(emp.base_payable).toEqual(4000);
  });

  test('Should prorate employee salary', () => {
    meta.proRates = entries.case1;
    const res = processProRates({ organization, employee, proRateMonth: 'November', meta });
    const emp = <Employee>res[1];

    expect(emp.pro_rates).toBeDefined();
    expect(emp.pro_rates.length).toEqual(1);
    expect(emp.pro_rate_deduction).toEqual(48000);
    expect(emp.base_payable).toEqual(72000);
  });
});
