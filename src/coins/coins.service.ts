import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coin } from './entities/coin.entity';
import { CoinLocation } from './entities/coin-location.entity';
import { CreateCoinDto } from './dto/create-coin.dto';
import { CreateCoinLocationDto } from './dto/create-coin-location.dto';
import { UserService } from 'src/user/user.service';
import { CoinType } from 'src/enum/coin-type.enum';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coin)
    private readonly coinsRepository: Repository<Coin>,
    @InjectRepository(CoinLocation)
    private readonly locationRepository: Repository<CoinLocation>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Coin[]> {
    return this.coinsRepository.find();
  }

  async createCoin(createCoinDto: CreateCoinDto): Promise<Coin> {
    const coin = this.coinsRepository.create(createCoinDto);
    return this.coinsRepository.save(coin);
  }

  async createLocation(
    createLocationDto: CreateCoinLocationDto,
  ): Promise<CoinLocation> {
    const coin = await this.coinsRepository.findOneByOrFail({
      id: createLocationDto.coinId,
    });
    const location = this.locationRepository.create({
      latitude: createLocationDto.latitude,
      longitude: createLocationDto.longitude,
      coin,
    });
    return this.locationRepository.save(location);
  }

  async findNearbyCoins(
    latitude: number,
    longitude: number,
    radiusInMeters: number = 1000,
  ) {
    return this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.coin', 'coin')
      .where('location.isCaught = :isCaught', { isCaught: false })
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

  async findCoinLocationById(id: string): Promise<CoinLocation> {
    return this.locationRepository.findOneOrFail({ where: { id } });
  }

  async catchCoin(id: string, userId: string): Promise<CoinLocation> {
    const coinLocation = await this.locationRepository.findOneOrFail({
      where: { id },
      relations: ['coin'],
    });
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    coinLocation.isCaught = true;
    coinLocation.caughtAt = new Date();
    coinLocation.caughtBy = user;
    coinLocation.ownedBy = user;
    return this.locationRepository.save(coinLocation);
  }

  async findCaughtCoins(userId: string): Promise<CoinLocation[]> {
    return this.locationRepository.find({
      where: { caughtBy: { id: userId } },
      relations: ['coin'],
    });
  }

  async findOwnedCoins(userId: string): Promise<CoinLocation[]> {
    return this.locationRepository.find({
      where: { ownedBy: { id: userId } },
      relations: ['coin'],
    });
  }

  async updateUserScore(userId: string, coinType: CoinType) {
    return this.userService.updateScore(userId, coinType);
  }

  async cleanupUncaughtCoins() {
    await this.locationRepository
      .createQueryBuilder()
      .delete()
      .from(CoinLocation)
      .where('isCaught = :isCaught', { isCaught: false })
      .execute();
  }
}
