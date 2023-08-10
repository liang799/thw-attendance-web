import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { EntityManager, wrap } from "@mikro-orm/core";
import { User } from "./entities/user.entity";
import { UserRepository } from "./user.repostiory";

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UserRepository,
    private readonly em: EntityManager
  ) {
  }

  create(dto: CreateUserDto) {
    const entity = new User(dto.email, dto.password);
    return this.em.persistAndFlush(entity);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repository.findOne(id);
    wrap(user).assign(dto);
    await this.em.flush();
    return user;
  }

  remove(id: number) {
    return this.repository.nativeDelete(id);
  }

  async signIn(email, pass) {
    const user = await this.em.findOne(User, { email: email });
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
}
