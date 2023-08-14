import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEnum,
  IsLowercase,
  IsOptional,
  IsString,
  IsUppercase,
} from 'class-validator';
import { AccountType } from '../types/AccountType';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(() => AccountType)
  type: AccountType;

  @IsUppercase()
  @IsString()
  rank: string;

  @IsLowercase()
  @IsString()
  name?: string;
}
