import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CoinType } from 'src/enum/coin-type.enum';
import { ScoreStrategy } from './score.strategy';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly scoreStrategy: ScoreStrategy,
  ) {}

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsernameOrEmail(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ username }, { email: username }],
    });
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateScore(id: string, coinType: CoinType): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });

    const xp = user.xp + this.scoreStrategy.calculateXp(coinType, user.level);
    const { level, remainingXp } = this.scoreStrategy.calculateLevelAndXp(xp);
    user.level = level;
    user.xp = remainingXp;
    const savedUser = await this.userRepository.save(user);

    // Count owned coins
    const ownedCoinsCount = await this.getCoinsCount(id, 'ownedCoins');

    // Count caught coins
    const caughtCoinsCount = await this.getCoinsCount(id, 'caughtCoins');

    return {
      ...savedUser,
      ownedCoinsCount,
      caughtCoinsCount,
    };
  }

  async getProfile(id: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
    });

    // Count owned coins
    const ownedCoinsCount = await this.getCoinsCount(id, 'ownedCoins');

    // Count caught coins
    const caughtCoinsCount = await this.getCoinsCount(id, 'caughtCoins');

    return {
      ...user,
      ownedCoinsCount,
      caughtCoinsCount,
    };
  }

  private async getCoinsCount(
    userId: string,
    relation: 'ownedCoins' | 'caughtCoins',
  ) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin(`user.${relation}`, relation)
      .where('user.id = :id', { id: userId })
      .select(`COUNT(${relation}.id)`, 'count')
      .getRawOne<{ count: number }>()
      .then((result) => result?.count || 0);
  }
}
