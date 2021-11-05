import { unifiedPayroll } from '@src/index';
import { Intents } from '@src/types';

test('Should prepare data for create payroll', () => {
  const res = unifiedPayroll(Intents.Create).processAddons({
    organization: 'papa',
    employee: 'child',
    proRateMonth: 'May',
  });

  expect((res as any).organization).toBe('papa');
  expect((res as any).employee).toBe('child');
});
