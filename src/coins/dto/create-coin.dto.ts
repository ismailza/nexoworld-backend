import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CoinType } from 'src/enum/coin-type.enum';

export class CreateCoinDto {
  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsEnum(CoinType)
  @IsOptional()
  type?: CoinType;
}