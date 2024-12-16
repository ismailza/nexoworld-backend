import { Injectable } from '@nestjs/common';
import { AppResponse } from 'src/interfaces/app-response.interface';
import { AuthResponse } from 'src/interfaces/auth-response.interface';
import { LoginRequest } from 'src/interfaces/login-request.interface';
import { RegisterRequest } from 'src/interfaces/register-request.interface';
import { TokenService } from './token.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(private readonly tokenService: TokenService, private readonly userService: UserService) {}

  async login(request: LoginRequest): Promise<AuthResponse> {
    const user = await this.userService.findByUsernameOrEmail(request.username);
    if (!user || !bcrypt.compareSync(request.password, user.password)) {
      return null;
    }
    const tokens = await this.tokenService.generateTokenPair(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: user
    }
  }

  async register(request: RegisterRequest): Promise<User> {
    if (await this.userService.findByUsername(request.username) || await this.userService.findByEmail(request.email)) {
      return null;
    }

    const user = new User();
    user.name = request.name;
    user.gender = request.gender;
    user.username = request.username;
    user.email = request.email;
    user.password = bcrypt.hashSync(request.password, 10);

    return await this.userService.create(user);
  }

  async refresh(): Promise<AppResponse> {
    // TODO: Implement this method
    return null;
  }

}
