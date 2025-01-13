import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { Coin } from './entities/coin.entity';
import { CoinLocation } from './entities/coin-location.entity';
import { CoinsGateway } from './coins.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coin, CoinLocation]),
    AuthModule
  ],
  controllers: [CoinsController],
  providers: [CoinsService, CoinsGateway],
})
export class CoinsModule {}