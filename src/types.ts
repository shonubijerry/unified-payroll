import * as _ from '@/services/base';

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

export type Log = {
  events: [LogMessage];
};

export type LogMessage = { msg: string };

export type Organiztion = any;

export type Employee = any;

export type Prorate = any;

export type Meta = {
  proRateMonth: string;
  payrollDays?: number;
  paidDays?: number;
};

export type StandardDTO = {
  organization: Organiztion;
  employee: Employee;
  meta: Meta;
  proRates?: Prorate[];
};
