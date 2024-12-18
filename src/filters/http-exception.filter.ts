import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from 'src/exceptions/base.exception';
import { AppResponse } from 'src/interfaces/app-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details = undefined;

    // Handle known exceptions
    if (exception instanceof BaseException) {
      statusCode = exception.statusCode;
      message = exception.message;
      code = exception.code;
      details = exception.details;
    } 
    // Handle NestJS HTTP exceptions
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      message = typeof response === 'string' 
        ? response 
        : (response as any).message || exception.message;
      
      // Handle validation errors
      if (statusCode === HttpStatus.BAD_REQUEST && Array.isArray((response as any).message)) {
        code = 'VALIDATION_ERROR';
        details = (response as any).message;
      } else {
        code = `HTTP_${statusCode}`;
      }
    } 
    // Handle TypeORM errors
    else if ((exception as any)?.code?.startsWith('23')) {
      statusCode = HttpStatus.BAD_REQUEST;
      code = (exception as any).code;
      message = 'Database constraint violation';
      details = (exception as any).detail;
    }

    const errorResponse: AppResponse = {
      success: false,
      message,
    };

    // Print error to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(exception);
    }

    response
      .status(statusCode)
      .json(errorResponse);
  }
}
