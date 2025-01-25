import { Controller, Get, Post, Body, Query, UseGuards, Request, Param } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CreateCoinLocationDto } from './dto/create-coin-location.dto';
import { CreateCoinDto } from './dto/create-coin.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Get()
  findAll() {
    return this.coinsService.findAll();
  }

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

  @UseGuards(JwtAuthGuard)
  @Post('catch')
  catchCoin(@Query('coinLocationId') coinLocationId: string, @Request() req) {
    if (!coinLocationId) {
      throw new Error('Coin location ID is required');
    }
    
    return this.coinsService.catchCoin(coinLocationId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('caught')
  findCaught(@Request() req) {    
    return this.coinsService.findCaughtCoins(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('owned')
  findOwned(@Request() req) {
    return this.coinsService.findOwnedCoins(req.user.userId);
  }

}
