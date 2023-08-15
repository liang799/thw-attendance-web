import { Injectable, UnauthorizedException } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/mysql";
import { AuthRepository } from "./auth.repository";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { Auth } from "./entities/auth.entity";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly em: EntityManager,
    private jwtService: JwtService
  ) {
  }

  async register(registerDto: RegisterDto) {
    const password = await bcrypt.hash(registerDto.password, 5);
    const auth = new Auth();
    auth.username = registerDto.userName;
    auth.password = password;
    await this.em.persistAndFlush(auth);
    const payload = { sub: auth.id, username: registerDto.userName };
    return {
      id: auth.user?.id,
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  async login(loginDto: LoginDto) {
    const authUser = await this.repo.findOne({ username: loginDto.userName });
    const match = await bcrypt.compare(loginDto.password, authUser.password);
    if (!match) throw new UnauthorizedException();
    const payload = { sub: authUser.id, username: loginDto.userName };
    return {
      id: authUser.user?.id,
      access_token: await this.jwtService.signAsync(payload)
    };
  }
}
