import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateUserDto {
  @Matches(/^[A-Z]+$/)
  rank: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
