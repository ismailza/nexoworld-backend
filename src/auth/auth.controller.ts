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
    return this.authService.login(request);
  }

  @Post('register')
  async register(@Body() request: RegisterRequest): Promise<AppResponse> {
    return this.authService.register(request);
  }

  @Post('refresh')
  async refresh(): Promise<AppResponse> {
    return this.authService.refresh();
  }

}
