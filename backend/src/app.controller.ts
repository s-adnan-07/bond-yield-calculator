import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InputDto } from './dtos/input.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('calculate')
  calculate(@Body() inputDto: InputDto) {
    return this.appService.calculate(inputDto);
  }
}
