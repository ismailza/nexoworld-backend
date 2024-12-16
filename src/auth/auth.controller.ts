import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from 'src/interfaces/login-request.interface';
import { RegisterRequest } from 'src/interfaces/register-request.interface';
import { AppResponse } from 'src/interfaces/app-response.interface';
import { RefreshRequest } from 'src/interfaces/refresh-request.interface';
import { AuthResponse } from 'src/interfaces/auth-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() request: LoginRequest): Promise<AppResponse> {
    const response: AuthResponse = await this.authService.login(request);
    return {
      success: true,
      result: response,
      message: 'Login successful'
    };
  }

  @Post('register')
  async register(@Body() request: RegisterRequest): Promise<AppResponse> {
    await this.authService.register(request);
    return {
      success: true,
      message: 'Registration successful'
    };
  }

  @Post('refresh')
  async refresh(@Body() request: RefreshRequest): Promise<AppResponse> {
    const response: AuthResponse = await this.authService.refresh(request);
    return {
      success: true,
      result: response,
      message: 'Token refreshed'
    }
  }

}
