import * as _ from '@services/base';
import { Payload, PayrollData } from '@/interface';
import { Intents } from '@/types';

export class UnifiedPayroll {
  private registry = new Map<string, Service>();

  constructor() {
    this.registerServices();
  }

  register(key: string, service: Service): void {
    this.registry.set(key, service);
  }

  getService<T extends Service>(key: string): T {
    return this.registry.get(key) as T;
  }

  registerServices(): void {
    this.register(Intents.Default, new _.BaseService());
    this.register(Intents.Create, new _.CreateService());
    this.register(Intents.Edit, new _.EditService());
    this.register(Intents.CreateFromWorksheet, new _.CreateFromWorksheetService());
  }
}

export interface Service {
  processAddons(payload: Payload): PayrollData;
}

export interface PayrollService extends Service {
  others?(): any;
}
