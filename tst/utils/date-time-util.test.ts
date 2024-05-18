import { calculateDaysBetweenDates } from '../../src/utils/date-time-util';

describe('calculateDaysBetweenDates', () => {
  it('should return the correct number of days between two dates', () => {
    const startDate = '2023-01-01';
    const endDate = '2023-01-05';
    const result = calculateDaysBetweenDates(startDate, endDate);
    expect(result).toBe(4);
  });

  it('should return 0 if the dates are the same', () => {
    const startDate = '2023-01-01';
    const endDate = '2023-01-01';
    const result = calculateDaysBetweenDates(startDate, endDate);
    expect(result).toBe(0);
  });

  it('should return a negative number if the end date is before the start date', () => {
    const startDate = '2023-01-05';
    const endDate = '2023-01-01';
    const result = calculateDaysBetweenDates(startDate, endDate);
    expect(result).toBe(-4);
  });
});
