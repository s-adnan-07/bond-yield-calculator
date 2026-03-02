import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InputDto } from './dtos/input.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name, { timestamp: true });

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.log('GET /');
    return this.appService.getHello();
  }

  @Post('calculate')
  calculate(@Body() inputDto: InputDto) {
    this.logger.log('POST /calculate');
    return this.appService.calculate(inputDto);
  }
}
