import { IsMongoId } from "class-validator";

export class CreateAttendanceDto {
  @IsMongoId()
  user: string;

  @IsMongoId()
  availability: string;

  @IsMongoId()
  parade: string;
}
