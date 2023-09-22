import { IsEnum, IsString } from 'class-validator';
import { UserType } from '../types/UserType';

export class CreateUserDto {
  @IsEnum(UserType)
  type: UserType;

  @IsString()
  rank: string;

  @IsString()
  name: string;
}
