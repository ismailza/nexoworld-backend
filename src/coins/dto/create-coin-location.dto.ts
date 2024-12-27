import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateCoinLocationDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsString()
  coinId: string;
}