import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppResponse } from 'src/interfaces/app-response.interface';
import { LoginRequest } from 'src/interfaces/login-request.interface';
import { RegisterRequest } from 'src/interfaces/register-request.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(request: LoginRequest): Promise<AppResponse> {
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
