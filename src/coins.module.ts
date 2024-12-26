// src/coins/coins.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';


import { Coin } from './coins/entities/coin.entity';
import { CoinLocation } from './coins/entities/coin-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coin, CoinLocation])],
  controllers: [CoinsController],
  providers: [CoinsService],
})
export class CoinsModule {}