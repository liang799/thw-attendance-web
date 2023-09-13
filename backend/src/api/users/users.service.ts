import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  EntityManager,
  MikroORM,
  UseRequestContext,
  wrap,
} from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repostiory';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UserRepository,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  @UseRequestContext()
  create(dto: CreateUserDto) {
    const entity = new User();
    entity.rank = dto.rank;
    entity.name = dto.name;
    entity.type = dto.type;
    return this.em.persistAndFlush(entity);
  }

  @UseRequestContext()
  findAll() {
    return this.repository.findAll();
  }

  @UseRequestContext()
  findOne(id: number): Promise<User> {
    return this.repository.findOne(id);
  }

  @UseRequestContext()
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repository.findOne(id);
    wrap(user).assign(dto);
    await this.em.flush();
    return user;
  }

  @UseRequestContext()
  remove(id: number) {
    return this.repository.nativeDelete(id);
  }
}
