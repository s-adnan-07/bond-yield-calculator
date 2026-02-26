import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import IRR from './utils/irr';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, { provide: 'IRR', useValue: IRR }],
})
export class AppModule {}
