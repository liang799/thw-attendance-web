import {
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { AuthRepository } from '../auth.repository';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Entity({
  customRepository: () => AuthRepository,
})
export class Auth {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  username: string;

  @Property()
  password: string;

  @OneToOne({ nullable: true })
  user?: User;

  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const match = await bcrypt.compare(oldPassword, this.password);
    if (!match) throw new UnauthorizedException('Password does not match!');
    this.password = await bcrypt.hash(newPassword, 5);
  }
}
