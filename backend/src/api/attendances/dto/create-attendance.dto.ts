import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { AvailabilityType } from "../value-objects/Availability";

export class CreateAttendanceDto {
  @IsInt()
  user: number;

  @IsEnum(() => AvailabilityType)
  availability: AvailabilityType;

  @IsInt()
  parade: number;

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
