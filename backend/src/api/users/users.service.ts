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
import { Parade } from '../parades/entities/parade.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UserRepository,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) { }

  @UseRequestContext()
  async create(dto: CreateUserDto) {
    const user = new User();
    user.rank = dto.rank;
    user.name = dto.name;
    user.type = dto.type;
    await this.em.persist(user);

    const prevParade = await this.em.findOne(Parade, { endDate: null })
    if (prevParade) {
      const attendance = user.createBlankTemplateAttendance(prevParade);
      await this.em.persist(attendance);
    }
    return this.em.flush();
  }

  @UseRequestContext()
  findAll() {
    return this.repository.find({ hasLeftNode: false });
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
