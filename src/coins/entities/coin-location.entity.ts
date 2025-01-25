import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Coin } from './coin.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('coin_locations')
export class CoinLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;
  
  @ManyToOne(() => Coin, (coin) => coin.locations)
  coin: Coin;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({ default: false })
  isCaught: boolean;

  @ManyToOne(() => User, (user) => user.caughtCoins, { nullable: true })
  @JoinColumn()
  caughtBy: User;

  @Column({ nullable: true })
  caughtAt: Date;

  @ManyToOne(() => User, (user) => user.ownedCoins, { nullable: true })
  @JoinColumn()
  ownedBy: User;

}