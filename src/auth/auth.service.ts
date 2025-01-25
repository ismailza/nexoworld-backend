import { Injectable } from '@nestjs/common';
import { AuthResponse } from 'src/interfaces/auth-response.interface';
import { LoginRequest } from 'src/interfaces/login-request.interface';
import { RegisterRequest } from 'src/interfaces/register-request.interface';
import { TokenService } from './token.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { InvalidCredentialsException, InvalidTokenException, UserAlreadyExistsException } from 'src/exceptions/auth.exception';
import { RefreshRequest } from 'src/interfaces/refresh-request.interface';

@Injectable()
export class AuthService {

  constructor(private readonly tokenService: TokenService, private readonly userService: UserService) {}

  async login(request: LoginRequest): Promise<AuthResponse> {
    const user = await this.userService.findByUsernameOrEmail(request.username);
    if (!user || !bcrypt.compareSync(request.password, user.password)) {
      throw new InvalidCredentialsException();
    }
    const tokens = await this.tokenService.generateTokenPair(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: user
    }
  }

  async register(request: RegisterRequest): Promise<User> {
    if (await this.userService.findByUsername(request.username)) {
      throw new UserAlreadyExistsException('User with this username already exists');
    }

    if (await this.userService.findByEmail(request.email)) {
      throw new UserAlreadyExistsException('User with this email already exists');
    }

    const user = new User();
    user.name = request.name;
    user.gender = request.gender;
    user.username = request.username;
    user.email = request.email;
    user.password = bcrypt.hashSync(request.password, 10);

    return await this.userService.create(user);
  }

  async refresh(request: RefreshRequest): Promise<AuthResponse> {
    const isRefreshToken = await this.tokenService.validateTokenType(
      request.refreshToken,
      'refresh'
    );
    
    if (!isRefreshToken) {
      throw new InvalidTokenException('Invalid token type');
    }

    try {
      // Verify and decode the refresh token
      const decoded = await this.tokenService.verifyToken(request.refreshToken);
      
      // Get user from decoded token
      const user = await this.userService.findById(decoded.sub);
      if (!user) {
        throw new InvalidTokenException('User not found');
      }

      // Generate new token pair
      const tokens = await this.tokenService.generateTokenPair(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: request.refreshToken,
        user: user
      };
    } catch (error) {
      throw new InvalidTokenException('Invalid or expired refresh token');
    }
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userService.getProfile(userId);
    if (!user) {
      throw new InvalidCredentialsException('User not found');
    }
    return user;
  }

}
