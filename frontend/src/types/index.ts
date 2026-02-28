export type Severity = 'error' | 'info' | 'success' | 'warning'

export type SelectionChangeEvent =
  | React.ChangeEvent<HTMLInputElement, Element>
  | (Event & {
      target: {
        value: null
        name: string
      }
    })
  | React.ChangeEvent<
      Omit<HTMLInputElement, 'value'> & {
        value: number
      },
      Element
    >
  | (Event & {
      target: {
        value: number
        name: string
      }
    })

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
  // couponFrequency: T | null
  couponFrequency: 1 | 2 | 4 | 12
}
