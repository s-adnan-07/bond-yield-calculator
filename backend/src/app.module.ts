import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import addMonths from './utils/addMonths';
import IRR from './utils/irr';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000),
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
        errorMessage: config.get<string>(
          'THROTTLE_ERROR_MESSAGE',
          'Too many requests. Please try again later.',
        ),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'ADD_MONTHS', useValue: addMonths },
    { provide: 'IRR', useValue: IRR },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
