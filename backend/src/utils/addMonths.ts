import { addMonths as addMonthsFns } from 'date-fns';

export type AddMonthsFn = (date: Date, months: number) => Date;

/**
 * Adds a number of months to a date using date-fns.
 * Correctly handles leap years and variable month lengths (e.g. Jan 31 + 1 month → Feb 28/29).
 */
const addMonths: AddMonthsFn = (date: Date, months: number): Date => {
  return addMonthsFns(date, months);
};

export default addMonths;
