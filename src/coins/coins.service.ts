import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coin } from './entities/coin.entity';
import { CoinLocation } from './entities/coin-location.entity';
import { CreateCoinDto } from './dto/create-coin.dto';
import { CreateCoinLocationDto } from './dto/create-coin-location.dto';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coin)
    private coinsRepository: Repository<Coin>,
    @InjectRepository(CoinLocation)
    private locationRepository: Repository<CoinLocation>,
  ) {}

  async findAll(): Promise<Coin[]> {
    return this.coinsRepository.find();
  }

  async createCoin(createCoinDto: CreateCoinDto): Promise<Coin> {
    const coin = this.coinsRepository.create(createCoinDto);
    return this.coinsRepository.save(coin);
  }

  async createLocation(createLocationDto: CreateCoinLocationDto): Promise<CoinLocation> {
    const coin = await this.coinsRepository.findOneByOrFail({ id: createLocationDto.coinId });
    const location = this.locationRepository.create({
      latitude: createLocationDto.latitude,
      longitude: createLocationDto.longitude,
      coin,
    });
    return this.locationRepository.save(location);
  }

  async findNearbyCoins(latitude: number, longitude: number, radiusInMeters: number = 1000) {
    return this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.coin', 'coin')
      .where('location.isActive = :isActive', { isActive: true })
      .andWhere(
        '(6371 * acos(cos(radians(:latitude)) * cos(radians(location.latitude)) * cos(radians(location.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(location.latitude)))) <= :radius',
        {
          latitude,
          longitude,
          radius: radiusInMeters / 1000, // Convert to kilometers
        },
      )
      .getMany();
  }
}