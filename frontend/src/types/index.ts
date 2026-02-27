export interface CashflowRecord {
  period: number
  cashFlow: number
  couponPayment: number
  cumulativeInterest: number
  remainingBalance: number
}

export interface OutputState {
  currentYield: number
  yieldToMaturity: number
  totalInterest: number
  indicator: string
  cashflowSchedule: CashflowRecord[]
}

export interface InputState<T = number> {
  faceValue: T | null
  marketPrice: T | null
  annualCouponRate: T | null
  yearsToMaturity: T | null
  couponFrequency: T | null
}
