import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { Coin } from './entities/coin.entity';
import { CoinLocation } from './entities/coin-location.entity';
import { CoinsGateway } from './coins.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CoinLocationGeneratorService } from './coin-location-generator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coin, CoinLocation]),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
  ],
  controllers: [CoinsController],
  providers: [CoinsService, CoinsGateway, CoinLocationGeneratorService],
})
export class CoinsModule {}