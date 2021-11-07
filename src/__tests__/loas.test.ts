import { cloneDeep } from 'lodash';

import * as fixtures from './fixtures/default.json';
import * as salaryLoans from './fixtures/salaryLoans.json';
import { Employee, Meta, Organiztion } from '@src/types';
import { processLoans, processCDBLoans } from '@src/index';

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

describe('CDB Loans (e2e)', () => {
  beforeEach(async () => {
    const fix: any = cloneDeep(fixtures);

    organization = fix.organizations[0];
    employee = fix.employees[0];
    ({ entries } = <any>salaryLoans);
  });
  test('Should process CDB loans', () => {
    meta.cdbLoans = entries.case2;
    meta.verifiTransferFee = 100;
    const res = processCDBLoans({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];

    expect(emp.cdb_loan_deductions.length).toEqual(1);
    expect(emp.total_cdb_loan_deduction).toEqual(49000);
    expect(emp.total_cdb_loan_bento_commission).toEqual(1000);
    expect(emp.total_cdb_loan_bento_commission_transfer_fee).toEqual(100);
    expect(emp.net_income).toEqual(69900);
  });

  test('Should abort if CDB loan passed empty', () => {
    meta.cdbLoans = [];
    meta.verifiTransferFee = 100;
    const res = processCDBLoans({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];

    expect(emp.cdb_loan_deductions).toBeUndefined();
    expect(emp.total_cdb_loan_deduction).toBeUndefined();
    expect(emp.total_cdb_loan_bento_commission).toBeUndefined();
    expect(emp.total_cdb_loan_bento_commission_transfer_fee).toBeUndefined();
    expect(emp.net_income).toBeUndefined();
  });

  test('Should process CDB loan with zero bento commission', () => {
    meta.cdbLoans = entries.case3;
    meta.verifiTransferFee = 100;
    const res = processCDBLoans({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];

    expect(emp.cdb_loan_deductions.length).toEqual(1);
    expect(emp.total_cdb_loan_deduction).toEqual(49000);
    expect(emp.total_cdb_loan_bento_commission).toEqual(0);
    expect(emp.total_cdb_loan_bento_commission_transfer_fee).toEqual(0);
    expect(emp.net_income).toEqual(71000);
  });

  test('Should set bento transfer fee to zero if verifiTransferFee is not passed in', () => {
    meta.cdbLoans = entries.case4;
    meta.verifiTransferFee = 100;
    const res = processCDBLoans({ organization, employee, proRateMonth, meta });
    const emp = <Employee>res[1];

    expect(emp.cdb_loan_deductions.length).toEqual(1);
    expect(emp.total_cdb_loan_deduction).toEqual(49000);
    expect(emp.total_cdb_loan_bento_commission).toEqual(0);
    expect(emp.total_cdb_loan_bento_commission_transfer_fee).toEqual(0);
    expect(emp.net_income).toEqual(71000);
  });
});
