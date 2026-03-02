import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InputDto } from './dtos/input.dto';
import type { AddMonthsFn } from './utils/addMonths';
import type IRR from './utils/irr';

// TODO: Work on input validation
// TODO: Implement JSDOC

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject('ADD_MONTHS') private readonly addMonths: AddMonthsFn,
    @Inject('IRR') private readonly irr: typeof IRR,
  ) {}

  onModuleInit() {
    this.logger.log('AppService initialized');
  }

  getHello(): string {
    return 'Hello World!';
  }

  calculate({
    annualCouponRate,
    faceValue,
    marketPrice,
    yearsToMaturity,
    couponFrequency,
  }: InputDto) {
    let currentYield = this.getCurrentYield(
      annualCouponRate,
      faceValue,
      marketPrice,
    );

    currentYield = Number(currentYield.toFixed(5));

    const totalInterest = this.getTotalInterest(
      annualCouponRate,
      faceValue,
      yearsToMaturity,
    );

    const indicator = this.getIndicator(faceValue, marketPrice);

    const cashflowSchedule = this.getCashflowSchedule(
      annualCouponRate,
      faceValue,
      marketPrice,
      couponFrequency,
      yearsToMaturity,
    );

    const cashflowValues = cashflowSchedule.map((item) => item.cashFlow);

    let yieldToMaturity = this.getYieldToMaturity(
      cashflowValues,
      couponFrequency,
    );

    yieldToMaturity = Number(yieldToMaturity.toFixed(5));

    return {
      currentYield,
      yieldToMaturity,
      totalInterest,
      indicator,
      cashflowSchedule,
    };
  }

  // Validate these values in the controller
  getCurrentYield(
    annualCouponRate: number,
    faceValue: number,
    marketPrice: number,
  ): number {
    const annualCouponPayment = faceValue * annualCouponRate;
    const currentYield = annualCouponPayment / marketPrice;

    return currentYield;
  }

  getTotalInterest(
    annualCouponRate: number,
    faceValue: number,
    yearsToMaturity: number,
  ): number {
    const annualCouponPayment = faceValue * annualCouponRate;
    return annualCouponPayment * yearsToMaturity;
  }

  getIndicator(faceValue: number, marketPrice: number) {
    if (marketPrice < faceValue) {
      return 'Discount';
    }

    if (marketPrice > faceValue) {
      return 'Premium';
    }

    return 'Par';
  }

  getYieldToMaturity(cashflowValues: number[], couponFrequency: number) {
    return this.irr(cashflowValues) * couponFrequency;
  }

  getCashflowSchedule(
    annualCouponRate: number,
    faceValue: number,
    marketPrice: number,
    couponFrequency: number,
    yearsToMaturity: number,
  ) {
    const totalCoupons = couponFrequency * yearsToMaturity;
    const couponPayment = (faceValue * annualCouponRate) / couponFrequency;
    let cumulativeInterest = 0;

    const settlementDate = new Date();
    const monthsPerPeriod = 12 / couponFrequency;

    // Initial cashflow, i.e. bond purchase
    const cashflowSchedule = [
      {
        period: 0,
        paymentDate: settlementDate.toISOString().split('T')[0],
        cashFlow: -marketPrice,
        couponPayment: 0,
        cumulativeInterest: 0,
        remainingBalance: faceValue,
      },
    ];

    for (let i = 0; i < totalCoupons; i++) {
      cumulativeInterest += couponPayment;

      let cashFlow = couponPayment + (i === totalCoupons - 1 ? faceValue : 0);
      let remainingBalance = i === totalCoupons - 1 ? 0 : faceValue;

      const paymentDate = this.addMonths(
        settlementDate,
        (i + 1) * monthsPerPeriod,
      );

      cashflowSchedule.push({
        period: i + 1,
        paymentDate: paymentDate.toISOString().split('T')[0],
        cashFlow,
        couponPayment,
        cumulativeInterest,
        remainingBalance,
      });
    }

    return cashflowSchedule;
  }
}
