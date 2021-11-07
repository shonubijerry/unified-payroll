import { isEmpty } from 'lodash';

import { Logger, StandardDTO, StandardRes, SalaryLoan, CDBLoan } from '@src/types';

/**
 * Process Salary loan requests. These are pay loans
 * Pass in the loan requests after they have been fetched from db
 * @param {StandardDTO} payload StandardDTO - { organization, employee, proRateMonth, meta: { salaryLoans } }
 * @returns [organization, employee, proRateMonth, { log }]
 */
export const processLoans = (payload: StandardDTO): StandardRes => {
  const log: Logger = { events: [{ msg: '' }] };
  const { organization, employee, proRateMonth, meta } = payload;
  const { salaryLoans } = meta;

  if (isEmpty(salaryLoans)) return [organization, employee, proRateMonth, { log }];

  employee.loan_deductions = [];
  employee.total_loan_deduction = 0;
  employee.loan_disbursements = [];
  employee.total_loan_disbursement = 0;

  // loop just once to save time complexity
  (<SalaryLoan[]>salaryLoans).forEach((loan: SalaryLoan) => {
    if (['disbursed', 'refunding'].includes(loan.status)) {
      employee.loan_deductions.push({
        id: loan.id,
        amount: loan.repayment_amount,
      });
      employee.total_loan_deduction += loan.repayment_amount;
    }

    if (['approved', 'confirmed', 'pending-disbursement'].includes(loan.status)) {
      employee.loan_disbursements.push({
        id: loan.id,
        amount: loan.advance_amount,
      });
      employee.total_loan_disbursement += loan.advance_amount;
    }
  });

  return [organization, employee, proRateMonth, { log }];
};

  /**
   * Process CDB loans
   * Pass in the loan requests after they have been fetched from cdb
   * @param {StandardDTO} payload StandardDTO - { organization, employee, proRateMonth, meta: { cdbLoans } }
   * @returns [organization, employee, proRateMonth, { log }]
   */
  export const processCDBLoans = (payload: StandardDTO): StandardRes => {
    const log: Logger = { events: [{ msg: '' }] };
    const { organization, employee, proRateMonth, meta } = payload;
    const { cdbLoans, verifiTransferFee } = meta;

    if (isEmpty(cdbLoans)) return [organization, employee, proRateMonth, { log }];

    employee.cdb_loan_deductions = <CDBLoan[]>cdbLoans;

    employee.total_cdb_loan_deduction = (<CDBLoan[]>cdbLoans).reduce(
      (acc, loan) => acc + loan.amount.value,
      0
    );

    employee.total_cdb_loan_bento_commission = 0;
    employee.total_cdb_loan_bento_commission_transfer_fee = 0;
    employee.cdb_loan_deductions.forEach(d => {
      if (!d.bentoCommission) {
        return;
      }
      const { value } = d.bentoCommission;
      employee.total_cdb_loan_bento_commission += value;
      employee.total_cdb_loan_bento_commission_transfer_fee +=
        value > 0 ? <number>verifiTransferFee : 0;
    });
    const base = employee.base_payable || employee.base_salary;

    // allowance_payable holds the combination of monies that are not
    // normal salary i.e. bonus, deductions
    employee.net_income =
      (employee.net_income || base) -
      employee.total_cdb_loan_deduction -
      employee.total_cdb_loan_bento_commission_transfer_fee -
      employee.total_cdb_loan_bento_commission;


    return [organization, employee, proRateMonth, { log }];
};
