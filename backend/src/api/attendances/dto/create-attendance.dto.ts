import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { AttendanceStatus } from './attendance-status';

export class CreateAttendanceDto {
  @IsInt()
  user: number;

  @IsEnum(AttendanceStatus)
  availability: AttendanceStatus;

  // @IsInt()
  // parade: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsDateString()
  @IsOptional()
  mcStartDate: string;

  @IsDateString()
  @IsOptional()
  mcEndDate: string;
}
