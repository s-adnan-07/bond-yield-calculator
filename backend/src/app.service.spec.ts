import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;
  let irrMock: jest.Mock;

  beforeEach(async () => {
    irrMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'IRR',
          useValue: irrMock,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appService.getHello()).toBe('Hello World!');
    });
  });

  describe('getCurrentYield', () => {
    it('should compute current yield as annual coupon payment divided by market price', () => {
      const annualCouponRate = 0.05;
      const faceValue = 1000;
      const marketPrice = 950;

      const result = appService.getCurrentYield(
        annualCouponRate,
        faceValue,
        marketPrice,
      );

      const expected = (1000 * 0.05) / 950; // 50 / 950
      expect(result).toBeCloseTo(expected);
    });

    it('should return 0.05 when coupon equals 5% of face and market price equals face', () => {
      expect(
        appService.getCurrentYield(0.05, 1000, 1000),
      ).toBeCloseTo(0.05);
    });
  });

  describe('getTotalInterest', () => {
    it('should return total interest over life of bond', () => {
      const annualCouponRate = 0.04;
      const faceValue = 1000;
      const yearsToMaturity = 10;

      const result = appService.getTotalInterest(
        annualCouponRate,
        faceValue,
        yearsToMaturity,
      );

      expect(result).toBe(1000 * 0.04 * 10); // 400
    });
  });

  describe('getIndicator', () => {
    it('should return "Discount" when market price is less than face value', () => {
      expect(appService.getIndicator(1000, 900)).toBe('Discount');
    });

    it('should return "Premium" when market price is greater than face value', () => {
      expect(appService.getIndicator(1000, 1100)).toBe('Premium');
    });

    it('should return "Par" when market price equals face value', () => {
      expect(appService.getIndicator(1000, 1000)).toBe('Par');
    });
  });

  describe('getYieldToMaturity', () => {
    it('should return IRR result multiplied by coupon frequency', () => {
      const cashflowValues = [-950, 25, 25, 1025];
      const couponFrequency = 2;
      irrMock.mockReturnValue(0.03);

      const result = appService.getYieldToMaturity(
        cashflowValues,
        couponFrequency,
      );

      expect(irrMock).toHaveBeenCalledWith(cashflowValues);
      expect(result).toBe(0.03 * 2); // 0.06
    });
  });

  describe('getCashflowSchedule', () => {
    it('should start with period 0 (purchase) as negative market price', () => {
      const schedule = appService.getCashflowSchedule(
        0.05,
        1000,
        980,
        1,
        2,
      );

      expect(schedule[0]).toEqual({
        period: 0,
        cashFlow: -980,
        couponPayment: 0,
        cumulativeInterest: 0,
        remainingBalance: 1000,
      });
    });

    it('should have correct number of periods (1 initial + couponFrequency * yearsToMaturity)', () => {
      const schedule = appService.getCashflowSchedule(
        0.04,
        1000,
        1000,
        2,
        3,
      );

      expect(schedule).toHaveLength(1 + 2 * 3); // 7 periods
    });

    it('should include face value in final period cash flow', () => {
      const annualCouponRate = 0.05;
      const faceValue = 1000;
      const couponPayment = (faceValue * annualCouponRate) / 1; // 50

      const schedule = appService.getCashflowSchedule(
        annualCouponRate,
        faceValue,
        1000,
        1,
        2,
      );

      const lastPeriod = schedule[schedule.length - 1];
      expect(lastPeriod.cashFlow).toBe(couponPayment + faceValue);
      expect(lastPeriod.remainingBalance).toBe(0);
    });

    it('should accumulate interest correctly across periods', () => {
      const schedule = appService.getCashflowSchedule(0.06, 1000, 1000, 1, 2);
      const couponPayment = 60;

      expect(schedule[1].cumulativeInterest).toBe(couponPayment);
      expect(schedule[2].cumulativeInterest).toBe(2 * couponPayment);
    });
  });

  describe('calculate', () => {
    it('should return currentYield, yieldToMaturity, totalInterest, indicator, and cashflowSchedule', () => {
      irrMock.mockReturnValue(0.04);

      const input = {
        annualCouponRate: 0.05,
        faceValue: 1000,
        marketPrice: 950,
        yearsToMaturity: 2,
        couponFrequency: 1,
      };

      const result = appService.calculate(input);

      expect(result).toHaveProperty('currentYield');
      expect(result).toHaveProperty('yieldToMaturity');
      expect(result).toHaveProperty('totalInterest');
      expect(result).toHaveProperty('indicator');
      expect(result).toHaveProperty('cashflowSchedule');
    });

    it('should round currentYield and yieldToMaturity to 5 decimal places', () => {
      irrMock.mockReturnValue(0.033333333);

      const result = appService.calculate({
        annualCouponRate: 0.05,
        faceValue: 1000,
        marketPrice: 1000,
        yearsToMaturity: 1,
        couponFrequency: 1,
      });

      expect(Number.isInteger(result.currentYield * 1e5)).toBe(true);
      expect(Number.isInteger(result.yieldToMaturity * 1e5)).toBe(true);
    });

    it('should set indicator to Discount when market price is below face value', () => {
      irrMock.mockReturnValue(0.05);

      const result = appService.calculate({
        annualCouponRate: 0.05,
        faceValue: 1000,
        marketPrice: 900,
        yearsToMaturity: 1,
        couponFrequency: 1,
      });

      expect(result.indicator).toBe('Discount');
    });

    it('should set indicator to Premium when market price is above face value', () => {
      irrMock.mockReturnValue(0.05);

      const result = appService.calculate({
        annualCouponRate: 0.05,
        faceValue: 1000,
        marketPrice: 1100,
        yearsToMaturity: 1,
        couponFrequency: 1,
      });

      expect(result.indicator).toBe('Premium');
    });

    it('should set indicator to Par when market price equals face value', () => {
      irrMock.mockReturnValue(0.05);

      const result = appService.calculate({
        annualCouponRate: 0.05,
        faceValue: 1000,
        marketPrice: 1000,
        yearsToMaturity: 1,
        couponFrequency: 1,
      });

      expect(result.indicator).toBe('Par');
    });

    it('should compute totalInterest correctly', () => {
      irrMock.mockReturnValue(0.05);

      const result = appService.calculate({
        annualCouponRate: 0.04,
        faceValue: 1000,
        marketPrice: 1000,
        yearsToMaturity: 5,
        couponFrequency: 1,
      });

      expect(result.totalInterest).toBe(1000 * 0.04 * 5); // 200
    });
  });
});
