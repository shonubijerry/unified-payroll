import { cloneDeep } from 'lodash';

import * as fixtures from './fixtures/default.json';
import * as salaryLoans from './fixtures/salaryLoans.json';
import { Employee, Meta, Organiztion } from '@src/types';
import { processLoans } from '@src/index';

let organization: Organiztion;
let employee: Employee;
const meta: Meta = {};
let entries: any;
const proRateMonth = 'November';

describe('Salary Loans (e2e)', () => {
  beforeEach(async () => {
    const fix: any = cloneDeep(fixtures);

    organization = fix.organizations[0];
    employee = fix.employees[0];
    ({ entries } = <any>salaryLoans);
  });
  test('Should process salary loans', () => {
    meta.salaryLoans = entries.case1;
    const res = processLoans({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];

    expect(emp.loan_deductions.length).toEqual(2);
    expect(emp.loan_disbursements.length).toEqual(1);
    expect(emp.total_loan_deduction).toEqual(126000);
    expect(emp.total_loan_disbursement).toEqual(30000);
  });

  test('Should abort if salary loan passed empty', () => {
    meta.salaryLoans = [];
    employee.application = '';
    const res = processLoans({ organization, employee, proRateMonth: 'November', meta });
    const emp = <Employee>res[1];

    expect(emp.loan_deductions).toBeUndefined();
    expect(emp.loan_disbursements).toBeUndefined();
    expect(emp.total_loan_deduction).toBeUndefined();
    expect(emp.total_loan_disbursement).toBeUndefined();
  });
});
