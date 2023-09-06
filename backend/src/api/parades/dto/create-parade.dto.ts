import { IsDateString, IsOptional } from 'class-validator';

export class CreateParadeDto {
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
