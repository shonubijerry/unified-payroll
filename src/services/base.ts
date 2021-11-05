/* tslint:disable:max-classes-per-file */

import { Payload, PayrollData } from '@src/interface';
import { PayrollService, Service } from '@services/payroll';

export class BaseService implements Service {
  processAddons(payload: Payload): PayrollData {
    const { organization, employee } = payload;
    return { organization, employee };
  }
}

export class CreateService extends BaseService implements PayrollService {}

export class EditService extends BaseService implements PayrollService {}

export class CreateFromWorksheetService extends BaseService implements PayrollService {}
