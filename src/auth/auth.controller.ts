import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from 'src/interfaces/login-request.interface';
import { RegisterRequest } from 'src/interfaces/register-request.interface';
import { AppResponse } from 'src/interfaces/app-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() request: LoginRequest): Promise<AppResponse> {
    const response = await this.authService.login(request);
    if (!response) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }
    return {
      success: true,
      result: response,
      message: 'Login successful'
    };
  }

  @Post('register')
  async register(@Body() request: RegisterRequest): Promise<AppResponse> {
    if (!await this.authService.register(request)) {
      return {
        success: false,
        message: 'Username or email already exists'
      };
    }
    return {
      success: true,
      message: 'Registration successful'
    };
  }

  @Post('refresh')
  async refresh(): Promise<AppResponse> {
    return this.authService.refresh();
  }

}
