import { isEmpty } from 'lodash';

import { Logger, StandardDTO, ProRateRes, SalaryLoans } from '@src/types';

/**
 * Process Salary loan requests. These are pay loans
 * Pass in the loan requests after they have been fetched from db
 * @param {StandardDTO} payload StandardDTO - { organization, employee, proRateMonth, meta: { salaryLoans } }
 * @returns [organization, employee, proRateMonth, log]
 */
export const processLoans = (payload: StandardDTO): ProRateRes => {
  const log: Logger = { events: [{ msg: '' }] };
  const { organization, employee, proRateMonth, meta } = payload;
  const { salaryLoans } = meta;

  if (isEmpty(salaryLoans)) return [organization, employee, proRateMonth, log];

  employee.loan_deductions = [];
  employee.total_loan_deduction = 0;
  employee.loan_disbursements = [];
  employee.total_loan_disbursement = 0;

  // loop just once to save time complexity
  (<SalaryLoans[]>salaryLoans).forEach((loan: SalaryLoans) => {
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

  return [organization, employee, proRateMonth, log];
};
