import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('App is running on port:', process.env.APP_PORT ?? 3000);

  // Enable global prefix
  app.setGlobalPrefix('/api/v1');

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Enable class serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
