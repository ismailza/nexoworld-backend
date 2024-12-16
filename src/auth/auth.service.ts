import { Injectable } from '@nestjs/common';
import { AppResponse } from 'src/interfaces/app-response.interface';
import { AuthResponse } from 'src/interfaces/auth-response.interface';
import { LoginRequest } from 'src/interfaces/login-request.interface';
import { RegisterRequest } from 'src/interfaces/register-request.interface';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {

  constructor(private readonly tokenService: TokenService) {}

  async login(request: LoginRequest): Promise<AppResponse<AuthResponse>> {
    // TODO: Implement this method
    return null;
  }

  async register(request: RegisterRequest): Promise<AppResponse> {
    // TODO: Implement this method
    return null;
  }

  async refresh(): Promise<AppResponse> {
    // TODO: Implement this method
    return null;
  }

}
