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

test('Should prepare data for edit payroll', () => {
  const res = unifiedPayroll(Intents.Edit).processAddons({
    organization: 'papa',
    employee: 'child',
    proRateMonth: 'May',
  });

  expect((res as any).organization).toBe('papa');
  expect((res as any).employee).toBe('child');
  expect((res as any).other).toBeDefined();
  expect((res as any).other).toBe('papa-child');
});

test('Should prepare data for create payroll from worksheet', () => {
  const res = unifiedPayroll(Intents.CreateFromWorksheet).processAddons({
    organization: 'papa',
    employee: 'child',
    proRateMonth: 'May',
  });

  expect((res as any).other).toBeDefined();
  expect((res as any).other).toBe('papa-papa');
});
