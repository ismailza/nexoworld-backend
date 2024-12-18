import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class InvalidCredentialsException extends BaseException {
  constructor(message: string = 'Invalid credentials', code: string = 'INVALID_CREDENTIALS') {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      code
    );
  }
}

export class UserNotFoundException extends BaseException {
  constructor(message: string = 'User not found', code: string = 'USER_NOT_FOUND') {
    super(
      message,
      HttpStatus.NOT_FOUND,
      code
    );
  }
}

export class UserAlreadyExistsException extends BaseException {
  constructor(message: string = 'User already exists', code: string = 'USER_ALREADY_EXISTS') {
    super(
      message,
      HttpStatus.CONFLICT,
      code
    );
  }
}

export class InvalidTokenException extends BaseException {
  constructor(message: string = 'Invalid token', code: string = 'INVALID_TOKEN') {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      code
    );
  }
}