import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class InputDto {
  @IsPositive()
  faceValue: number;

  @IsPositive()
  marketPrice: number;

  @IsPositive()
  annualCouponRate: number;

  @IsPositive()
  yearsToMaturity: number;

  @IsNumber()
  @Max(12)
  @Min(0)
  couponFrequency: number;
}
