import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {

  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message, statusCode);
  }
  
}