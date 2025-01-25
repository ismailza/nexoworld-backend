import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ScoreStrategy } from './score.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ])
  ],
  controllers: [UserController],
  providers: [UserService, ScoreStrategy],
  exports: [UserService],
})
export class UserModule {}
