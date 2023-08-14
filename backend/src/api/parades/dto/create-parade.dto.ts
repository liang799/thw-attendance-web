import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ParadeType } from '../type/ParadeType';

export class CreateParadeDto {
  @IsEnum(ParadeType)
  type: ParadeType;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;
}
