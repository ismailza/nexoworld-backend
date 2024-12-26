// src/coins/entities/coin-location.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Coin } from './coin.entity';

@Entity('coin_locations')
export class CoinLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Coin, (coin) => coin.locations)
  coin: Coin;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}