import { unifiedPayroll } from '@/index';
import { Intents } from '@/types';

test('Should prepare data for create payroll', () => {
  const res = unifiedPayroll(Intents.Create).processAddons({
    organization: 'papa',
    employee: 'child',
    proRateMonth: 'May',
  });

  expect((res as any).organization).toBe('papa');
  expect((res as any).employee).toBe('child');
});
