import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  onModuleInit() {
    this.logger.log('AppService initialized');
    // const result = this.getCurrentYield(0.06, 1000, 950);
    // console.log(result);
    // console.log(result.toFixed(3));
    // const result = this.getCashflowSchedule(0.06, 1000, 2, 5);
    // console.log(result);
  }

  getHello(): string {
    return 'Hello World!';
  }

  // Validate these values in the controller
  getCurrentYield(
    annualCouponRate: number,
    faceValue: number,
    marketPrice: number,
  ): number {
    const annualCouponPayment = faceValue * annualCouponRate;
    const currentYield = (annualCouponPayment / marketPrice) * 100;

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

  getCashflowSchedule(
    annualCouponRate: number,
    faceValue: number,
    couponFrequency: number,
    yearsToMaturity: number,
  ): any[] {
    // Total rows in the cashflow schedule table
    const totalCoupons = couponFrequency * yearsToMaturity;
    const couponPayment = (faceValue * annualCouponRate) / couponFrequency;
    let cumulativeInterest = 0;

    const cashflowSchedule = [];

    for (let i = 0; i < totalCoupons; i++) {
      cumulativeInterest += couponPayment;

      cashflowSchedule.push({
        period: i,
        couponPayment,
        cumulativeInterest,
        remainingBalance: i == totalCoupons - 1 ? 0 : faceValue,
      });
    }

    return cashflowSchedule;
  }
}
