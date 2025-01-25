import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IUser } from "src/interfaces/user.interface";
import { Gender } from 'src/enums/gender.enum';
import { CoinLocation } from 'src/coins/entities/coin-location.entity';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({
    type: 'enum',
    enum: Gender
  })
  gender: Gender;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  avatar?: string;
  @Column({ unique: true })
  username: string;
  @Column()
  @Exclude()
  password: string;
  @Column({ default: false })
  isVerified: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({ default: 0 })
  xp: number;
  @Column({ default: 1 })
  level: number;

  @OneToMany(() => CoinLocation, (coinLocation) => coinLocation.ownedBy)
  ownedCoins: CoinLocation[];

  @OneToMany(() => CoinLocation, (coinLocation) => coinLocation.caughtBy)
  caughtCoins: CoinLocation[];

  ownedCoinsCount: number;
  caughtCoinsCount: number;

}