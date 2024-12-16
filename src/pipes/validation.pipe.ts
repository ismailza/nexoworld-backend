import { ValidationPipe } from '@nestjs/common';
import { BaseException } from 'src/exceptions/base.exception';

export const GlobalValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  errorHttpStatusCode: 400,
  exceptionFactory: (errors) => {
    const messages = errors.map(error => 
      Object.values(error.constraints)
    ).flat();
    
    return new BaseException(
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      messages
    );
  },
});