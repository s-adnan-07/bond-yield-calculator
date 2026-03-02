import { IsNumber, IsPositive, IsIn, Max } from 'class-validator';

export class InputDto {
  @IsPositive()
  @Max(1000000000, {
    message: 'Face value must be less than or equal to 1,000,000,000',
  })
  faceValue: number;

  @IsPositive()
  @Max(1000000000, {
    message: 'Market price must be less than or equal to 1,000,000,000',
  })
  marketPrice: number;

  @IsPositive()
  @Max(100, { message: 'Annual coupon rate must be less than or equal to 100' })
  annualCouponRate: number;

  @IsPositive()
  @Max(100, { message: 'Years to maturity must be less than or equal to 100' })
  yearsToMaturity: number;

  @IsIn([1, 2, 4, 12], { message: 'Coupon frequency must be 1, 2, 4, or 12' })
  couponFrequency: number;
}
