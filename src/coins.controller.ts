// src/coins/coins.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CreateCoinLocationDto } from './coins/dto/create-coin-location.dto';
import { CreateCoinDto } from './coins/dto/create-coin.dto';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Post()
  createCoin(@Body() createCoinDto: CreateCoinDto) {
    return this.coinsService.createCoin(createCoinDto);
  }

  @Post('location')
  createLocation(@Body() createLocationDto: CreateCoinLocationDto) {
    return this.coinsService.createLocation(createLocationDto);
  }

  @Get('nearby')
  findNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number,
  ) {
    return this.coinsService.findNearbyCoins(latitude, longitude, radius);
  }
}
