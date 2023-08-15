import { IsEnum, IsString } from "class-validator";
import { BranchType } from "../types/BranchType";

export class CreateUserDto {
  @IsEnum(BranchType)
  type: BranchType;

  @IsString()
  rank: string;

  @IsString()
  name: string;
}
