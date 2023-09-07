import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './create-attendance.dto';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { AttendanceStatus } from './attendance-status';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {
  @IsInt()
  @IsOptional()
  user: number;

  @IsEnum(AttendanceStatus)
  availability: AttendanceStatus;
}
