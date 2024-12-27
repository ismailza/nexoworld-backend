import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Coin } from './coins/entities/coin.entity';
import { CoinLocation } from './coins/entities/coin-location.entity';
import { CoinsModule } from './coins/coins.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): PostgresConnectionOptions => ({
        type: configService.get('DB_CONNECTION'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          User,
          Coin,
          CoinLocation
        ],
        synchronize: configService.get('APP_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    CoinsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
