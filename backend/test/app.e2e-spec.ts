import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
// import { APP_GUARD } from '@nestjs/core';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  const validCalculateBody = {
    faceValue: 1000,
    marketPrice: 950,
    annualCouponRate: 0.05,
    yearsToMaturity: 2,
    couponFrequency: 1,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider(APP_GUARD)
      // .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('/ (GET) should return 200 and Hello World!', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('POST /calculate should return 201 and calculation result for valid body', () => {
    return request(app.getHttpServer())
      .post('/calculate')
      .send(validCalculateBody)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('currentYield');
        expect(res.body).toHaveProperty('yieldToMaturity');
        expect(res.body).toHaveProperty('totalInterest');
        expect(res.body).toHaveProperty('indicator');
        expect(res.body).toHaveProperty('cashflowSchedule');
        expect(res.body.indicator).toBe('Discount');
      });
  });

  it('POST /calculate should return 400 when request body fails validation', () => {
    return request(app.getHttpServer())
      .post('/calculate')
      .send({
        ...validCalculateBody,
        couponFrequency: 3,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
        expect(Array.isArray(res.body.message)).toBe(true);
        expect(
          res.body.message.some((m: string) => m.includes('Coupon frequency')),
        ).toBe(true);
      });
  });
});
