import { IsInt } from "class-validator";

export class CreateAttendanceDto {
  @IsInt()
  user: number;

  @IsInt()
  availability: number;

  @IsInt()
  parade: number;
}
