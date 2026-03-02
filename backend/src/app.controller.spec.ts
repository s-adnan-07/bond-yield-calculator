import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const validCalculateInput = {
    faceValue: 1000,
    marketPrice: 950,
    annualCouponRate: 0.05,
    yearsToMaturity: 2,
    couponFrequency: 1,
  };

  beforeEach(async () => {
    const mockAppService = {
      getHello: jest.fn().mockReturnValue('Hello World!'),
      calculate: jest.fn().mockReturnValue({
        currentYield: 0.05263,
        yieldToMaturity: 0.06,
        totalInterest: 100,
        indicator: 'Discount',
        cashflowSchedule: [],
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
      expect(appService.getHello).toHaveBeenCalled();
    });
  });

  describe('POST /calculate', () => {
    it('should return result from AppService.calculate with valid input', () => {
      const result = appController.calculate(validCalculateInput);

      expect(appService.calculate).toHaveBeenCalledWith(validCalculateInput);
      expect(result).toEqual({
        currentYield: 0.05263,
        yieldToMaturity: 0.06,
        totalInterest: 100,
        indicator: 'Discount',
        cashflowSchedule: [],
      });
    });

    it('should return indicator "Premium" when market price is above face value', () => {
      (appService.calculate as jest.Mock).mockReturnValue({
        currentYield: 0.04,
        yieldToMaturity: 0.03,
        totalInterest: 100,
        indicator: 'Premium',
        cashflowSchedule: [],
      });

      const result = appController.calculate({
        ...validCalculateInput,
        marketPrice: 1100,
      });

      expect(result.indicator).toBe('Premium');
    });
  });
});
