import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class InvalidCredentialsException extends BaseException {
  constructor(message?: string, code?: string) {
    super(
      message ?? 'Invalid credentials',
      HttpStatus.UNAUTHORIZED,
      code ?? 'INVALID_CREDENTIALS'
    );
  }
}

export class UserNotFoundException extends BaseException {
  constructor(message?: string, code?: string) {
    super(
      message ?? 'User not found',
      HttpStatus.NOT_FOUND,
      code ?? 'USER_NOT_FOUND'
    );
  }
}

export class UserAlreadyExistsException extends BaseException {
  constructor(message?: string, code?: string) {
    super(
      message ?? 'User already exists',
      HttpStatus.CONFLICT,
      code ?? 'USER_ALREADY_EXISTS'
    );
  }
}
