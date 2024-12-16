import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  
  constructor(private readonly userRepository: UserRepository) {}

  async findByUsernameOrEmail(username: string): Promise<User> {
    return this.userRepository.findOne({ where: [{ username }, { email: username }] });
  }
}
