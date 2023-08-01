import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { ParadeType } from "../entities/parade.entity";

export class CreateParadeDto {
  @IsEnum(ParadeType)
  type: ParadeType;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;
}
