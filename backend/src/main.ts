import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('API_PREFIX') ?? 'api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(configService.get('SERVER_PORT') ?? 5000);
}
bootstrap();
