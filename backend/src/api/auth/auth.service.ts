import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mysql';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Auth } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,
    private jwtService: JwtService
  ) {
  }

  @UseRequestContext()
  async register(registerDto: RegisterDto) {
    const password = await bcrypt.hash(registerDto.password, 5);
    const auth = new Auth();
    auth.username = registerDto.userName;
    auth.password = password;
    await this.em.persistAndFlush(auth);
    const payload: PayloadType = { sub: auth.id, username: registerDto.userName };
    return {
      id: auth.user?.id,
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  @UseRequestContext()
  async login(loginDto: LoginDto) {
    const authUser = await this.repo.findOne({ username: loginDto.userName });
    if (!authUser) throw new UnauthorizedException();
    const match = await bcrypt.compare(loginDto.password, authUser.password);
    if (!match) throw new UnauthorizedException();
    const payload: PayloadType = { sub: authUser.id, username: loginDto.userName };
    return {
      id: authUser.user?.id,
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  @UseRequestContext()
  async changePassword(authHeader: string, dto: ChangePasswordDto) {
    const decodedJwt = this.jwtService.decode(authHeader.split(' ')[1]) as PayloadType;
    const authUser = await this.repo.findOneOrFail(decodedJwt.sub);
    await authUser.changePassword(dto.oldPassword, dto.futurePassword);
    return this.em.flush();
  }
}

type PayloadType = {
  sub: number,
  username: string
}
