// src/coins/entities/coin.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CoinLocation } from './coin-location.entity';
import { CoinType } from 'src/enum/coin-type.enum';

@Entity('coins')
export class Coin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column({
    type: 'enum',
    enum: CoinType,
    default: CoinType.COMMON
  })
  type: CoinType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CoinLocation, (location) => location.coin)
  locations: CoinLocation[];
}