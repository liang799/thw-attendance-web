import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './create-attendance.dto';
import { IsInt, IsOptional } from "class-validator";

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {
  @IsInt()
  @IsOptional()
  user: number;
}
