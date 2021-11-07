import * as _ from '@services/base';

export enum Intents {
  Create = 'create',
  Preview = 'preview',
  CreateFromWorksheet = 'create-from-workseet',
  Summary = 'summary',
  View = 'view',
  Edit = 'edit',
  AddTo = 'add-to',
  Default = 'default',
}

export type IntentServices = _.CreateService | _.EditService | _.CreateFromWorksheetService;

export type Logger = {
  events: [LogMessage];
};

export type LogMessage = { msg: string };

export type Organiztion = {
  id: string;
  name: string;
  email: string;
  phonenumber: string;
  emailVerified: boolean;
  payrollPaymentMethod: string;
  enabledSalaryBreakdown: boolean;
  enabledTaxes: boolean;
  enabledTaxRemit: boolean;
  enabledTaxFreeBonus: boolean;
  enabledPension: boolean;
  isSubscribed: boolean;
  isOnboarded: boolean;
  enabledHealthAccess: boolean;
  enabledNHFRemit: boolean;
  enabledNSITF: boolean;
  payFrequency: number;
  isDeleted: boolean;
  registerViaMywork: boolean;
  enabledPeopleHRM: boolean;
  maskBeneficiaries: boolean;
  loanServiceEnabled: boolean;
  switchToNuban: boolean;
  blockTransfer: boolean;
  emailVerificationCode: string;
  enabledSheetMode: boolean;
  enableAdvanceCriteriaBypass: boolean;
  enabledNHF: boolean;
  nhfID: string;
  basic_percent: number;
  housing_percent: number;
  transport_percent: number;
  pensionType: string;
  pencomNumber: string;
  enabledPensionRemit: boolean;
  taxStates: any[];
  country: string | object;
  paymentServiceType: string;
  peoplehrmID: string;
  employeeTransferFee: number;
  enabledITF: boolean;
  enabledNSITFRemit: boolean;
  enabledLeaveAllowance: boolean;
  leaveAllowancePercent: number;
  enabledITFRemit: boolean;
  itfID: string;
  enabledExtraMonth: boolean;
  extraMonthPercentage: number;
  extraMonth: string;
};

export type Employee = {
  id: string;
  bank: string | object;
  account_number: string;
  base_salary: number;
  userAccountCreated: boolean;
  peoplehrmID: string;
  application: string | Application;
  organization: string | Organiztion;
  salary: number;
  pay_frequency: string;
  enabledHealthAccess: boolean;
  healthAccessRemoved: boolean;
  isEnrolled: boolean;
  healthPromoActivated: boolean;
  isDeleted: boolean;
  isTerminated: boolean;
  enabledVoluntaryPensionContribution: boolean;
  hasDependant: boolean;
  maxDependants: number;
  registerViaMywork: boolean;
  joblossEnabled: boolean;
  joblossClaimFiled: boolean;
  joblossRenewed: boolean;
  joblossPreviouslyPurchased: boolean;
  joblossPurchased: boolean;
  ineligibleBentoPlus: boolean;
  paystackTransferCode: string;
  dummyDOB: boolean;
  nhf_payer_id: string;
  taxState: string | object;
  tax_payer_id: string;
  pencomNumber: string;
  pensionFundAdmin: string | object;
  enabledSavings: boolean;
  voluntaryPensionContribution: number;
  salaryBreakdown: {
    basic_percent: number;
    housing_percent: number;
    transport_percent: number;
    food: number;
    phone: number;
  };
  enabledSalaryBreakdown: boolean;
  group: string | object;
  enabledLeaveAllowance: boolean;
  leaveAllowance: number;
  allowance_payable: number;
  net_income: number;
  base_payable: number;
  pro_rates: Partial<Prorate>;
  pro_rate_deduction: number;
  total_loan_disbursement: number;
  total_loan_deduction: number;
  loan_deductions: Partial<SalaryLoan>[];
  loan_disbursements: Partial<SalaryLoan>[];
  bonuses: Partial<Bonus>[];
  total_bonus: number;
  untaxed_bonuses: Partial<Bonus>[];
  total_untaxed_bonus: number;
  extra_month_salary: number;
  extraMonth: Partial<Bonus>;
};

export type Application = {
  organization: string | Organiztion;
  firstname: string;
  lastname: string;
  sex: string;
  phonenumber: string;
  type: string;
  status: string;
  isVerified: boolean;
  email: string;
  isDeleted: boolean;
  token: string;
  person: string;
  id: string;
};

export type Country = {
  name: string;
  isonumber: string;
  dialCode: string;
  priority: number;
  symbol: string;
  code: string;
  areaCodes: string;
  isDeleted: boolean;
  imageUrl: string;
  isActive: boolean;
  id: string;
};

export type User = {
  employees: Employee[];
  organizations: Organiztion[];
  defaultOrganization: string | Organiztion;
  firstname: string;
  lastname: string;
  password: string;
  gender: string;
  phonenumber: string;
  role: string;
  email: string;
  dummyMail: boolean;
  isDeleted: boolean;
  isTerminated: boolean;
  payrollPaymentMethod: string;
  rewarded: boolean;
  person: string | any;
  country: string | Country;
  organization: string | Organiztion;
  id: string;
};

export type Prorate = any;

export type SalaryLoan = {
  id: string;
  amount: number;
  status: string;
  advance_amount: number;
  repayment_amount: number;
};

export type Bonus = {
  id: string;
  employee: string | Employee;
  type: string;
  mode: string;
  isDeleted: boolean;
  status: string;
  organization: string | Organiztion;
  amount: number;
  name: string;
  endDate: string;
  description: string;
};

export type Meta = {
  paidDays?: number;
  proRates?: Prorate[];
  salaryLoans?: SalaryLoan[];
  bonuses?: Bonus[];
  untaxedBonuses?: Bonus[];
  extraMonth?: Bonus;
};

export type StandardDTO = {
  organization: Organiztion;
  employee: Employee;
  proRateMonth: string;
  meta: Meta;
};

export type ResMeta = {
  log: Logger;
  extraMonthToCreate?: Partial<Bonus>;
  updateExtraMonth?: boolean;
};

export type StandardRes = [Organiztion, Employee, string, ResMeta];
