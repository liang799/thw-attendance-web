import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsEnum, IsLowercase, IsOptional, IsString, IsUppercase } from "class-validator";
import { PersonnelType } from "../types/PersonnelType";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(() => PersonnelType)
  type: PersonnelType;

  @IsUppercase()
  @IsString()
  rank: string;

  @IsLowercase()
  @IsString()
  name?: string;
}
