import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private static readonly JWT_ACCESS_TYPE = 'access';
  private static readonly JWT_REFRESH_TYPE = 'refresh';
  private static readonly JWT_ALGORITHM = 'HS256';

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(claims: any): Promise<string> {
    return this.jwtService.signAsync(
      claims,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: `${this.configService.get<string>('JWT_EXPIRATION_TIME_IN_MINUTES')}m`,
        header: {
          typ: TokenService.JWT_ACCESS_TYPE,
          alg: TokenService.JWT_ALGORITHM
        }
      }
    );
  }

  async generateRefreshToken(claims: any): Promise<string> {
    return this.jwtService.signAsync(
      claims,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME_IN_DAYS')}d`,
        header: {
          typ: TokenService.JWT_REFRESH_TYPE,
          alg: TokenService.JWT_ALGORITHM
        }
      }
    );
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET')
    });
  }

  async generateTokenPair(user: any): Promise<{ accessToken: string; refreshToken: string }> {
    const claims = {
      sub: user.id,
      username: user.username
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(claims),
      this.generateRefreshToken(claims)
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async decodeToken(token: string): Promise<any> {
    return this.jwtService.decode(token, { complete: true });
  }

  async validateTokenType(token: string, expectedType: 'access' | 'refresh'): Promise<boolean> {
    const decoded = await this.decodeToken(token);
    return decoded?.header?.typ === expectedType;
  }
}