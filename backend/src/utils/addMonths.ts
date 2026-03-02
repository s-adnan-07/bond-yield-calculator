export type AddMonthsFn = (date: Date, months: number) => Date;

const addMonths: AddMonthsFn = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export default addMonths;
