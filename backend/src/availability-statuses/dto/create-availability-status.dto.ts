import { IsEnum, IsNotEmpty } from "class-validator";
import { Availability } from "../types/Availability";

export class CreateAvailabilityStatusDto {

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  @IsEnum(Availability)
  availability: Availability;

}
