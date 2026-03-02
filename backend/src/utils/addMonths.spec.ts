import addMonths from './addMonths';

describe('addMonths', () => {
  it('adds integer months to a date', () => {
    const date = new Date(2024, 0, 15); // 15 Jan 2024
    expect(addMonths(date, 1)).toEqual(new Date(2024, 1, 15)); // 15 Feb 2024
    expect(addMonths(date, 3)).toEqual(new Date(2024, 3, 15)); // 15 Apr 2024
  });

  it('handles Jan 31 + 1 month as last day of February (no overflow to March)', () => {
    const date = new Date(2024, 0, 31); // 31 Jan 2024
    const result = addMonths(date, 1);
    // 2024 is a leap year → Feb 29
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(29);
  });

  it('handles Jan 31 + 1 month in non-leap year as Feb 28', () => {
    const date = new Date(2023, 0, 31); // 31 Jan 2023
    const result = addMonths(date, 1);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(28);
  });

  it('handles Aug 31 + 1 month as Sep 30 (30 days)', () => {
    const date = new Date(2024, 7, 31); // 31 Aug 2024
    const result = addMonths(date, 1);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(8);
    expect(result.getDate()).toBe(30);
  });

  it('handles Mar 31 + 1 month as Apr 30', () => {
    const date = new Date(2024, 2, 31); // 31 Mar 2024
    const result = addMonths(date, 1);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(3);
    expect(result.getDate()).toBe(30);
  });

  it('does not mutate the original date', () => {
    const date = new Date(2024, 0, 15);
    const copy = new Date(date.getTime());
    addMonths(date, 2);
    expect(date.getTime()).toBe(copy.getTime());
  });
});
