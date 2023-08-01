import { IsEnum, IsNotEmpty } from "class-validator";
import { Availability } from "../entities/availability-status.entity";

export class CreateAvailabilityStatusDto {

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  @IsEnum(Availability)
  availability: Availability;

}
