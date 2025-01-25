import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CoinsService } from './coins.service';
import { CoinsGateway } from './coins.gateway';
import { CoinLocation } from './entities/coin-location.entity';
import { Coin } from './entities/coin.entity';
import { CoinType } from 'src/enum/coin-type.enum';
import { Location } from 'src/interfaces/location.interface';
import { CreateCoinLocationDto } from './dto/create-coin-location.dto';

@Injectable()
export class CoinLocationGeneratorService {
  private readonly logger = new Logger(CoinLocationGeneratorService.name);

  constructor(
    private readonly coinsService: CoinsService,
    private readonly coinsGateway: CoinsGateway,
  ) {}

  // @Cron('*/10 * * * * *')
  // @Cron(CronExpression.EVERY_10_MINUTES)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async generateCoinLocations() {
    try {
      // First, delete all uncaught coins
      await this.coinsService.cleanupUncaughtCoins();

      // Get all existing coins
      const coins = await this.coinsService.findAll();

      // Get connected users
      const connectedUsers = this.coinsGateway.getConnectedUsers();

      for (const [userId, userLocation] of connectedUsers) {
        await this.generateAndSendCoinLocationsForUser(
          coins,
          userId,
          userLocation,
        );
      }
    } catch (error) {
      this.logger.error('Error generating coin locations:', error);
    }
  }

  private async generateAndSendCoinLocationsForUser(
    coins: Coin[],
    userId: string,
    userLocation: Location,
  ) {
    try {
      const allGeneratedLocations: CoinLocation[] = [];

      for (const coin of coins) {
        const numberOfLocations = this.getNumberOfLocationsByCoinType(
          coin.type,
        );

        const coinLocations = await Promise.all(
          Array(numberOfLocations)
            .fill(null)
            .map(() => this.createCoinLocationNearUser(coin, userLocation)),
        );

        allGeneratedLocations.push(...coinLocations);
      }

      // Send all generated locations at once
      const userSocket = this.coinsGateway.getUserSocket(userId);
      if (userSocket && allGeneratedLocations.length > 0) {
        userSocket.emit('nearbyCoins', allGeneratedLocations);
        this.logger.log(
          `Sent ${allGeneratedLocations.length} coins to user ${userId} via socket ${userSocket.id}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error generating locations for user ${userId}:`,
        error,
      );
    }
  }

  private getNumberOfLocationsByCoinType(type: CoinType): number {
    switch (type) {
      case CoinType.LEGENDARY:
        return 1;
      case CoinType.EPIC:
        return 2;
      case CoinType.RARE:
        return 3;
      case CoinType.COMMON:
        return 5;
      default:
        return 1;
    }
  }

  private async createCoinLocationNearUser(
    coin: Coin,
    userLocation: Location,
  ): Promise<CoinLocation> {
    // Generate random distance based on coin type
    const maxDistance = this.getMaxDistanceByCoinType(coin.type);

    // Generate random offset within maxDistance
    const latOffset = (Math.random() - 0.5) * (maxDistance / 111111); // Convert meters to degrees
    const lngOffset =
      (Math.random() - 0.5) *
      (maxDistance /
        (111111 * Math.cos((userLocation.latitude * Math.PI) / 180)));

    const coinLocation = new CreateCoinLocationDto();
    coinLocation.latitude = userLocation.latitude + latOffset;
    coinLocation.longitude = userLocation.longitude + lngOffset;
    coinLocation.coinId = coin.id;

    return this.coinsService.createLocation(coinLocation);
  }

  private getMaxDistanceByCoinType(type: CoinType): number {
    switch (type) {
      case CoinType.LEGENDARY:
        return 100; // 100 meters
      case CoinType.EPIC:
        return 200; // 200 meters
      case CoinType.RARE:
        return 350; // 350 meters
      case CoinType.COMMON:
        return 500; // 500 meters
      default:
        return 500;
    }
  }
}
