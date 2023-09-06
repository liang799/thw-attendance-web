import { Injectable } from '@nestjs/common';
import { CreateParadeDto } from './dto/create-parade.dto';
import { UpdateParadeDto } from './dto/update-parade.dto';
import { ParadeRepository } from './parade.repository';
import { EntityManager, MikroORM, QueryOrder, UseRequestContext, wrap } from '@mikro-orm/core';
import { Parade } from './entities/parade.entity';
import { FindOneParadeDto } from './dto/find-one-parade.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ParadesService {
  constructor(
    private readonly repository: ParadeRepository,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  @UseRequestContext()
  async create(dto: CreateParadeDto) {
    const parade = new Parade(new Date(dto.startDate));
    const users = await this.em.find(User, {});
    if (!users) return this.em.persistAndFlush(parade);
    for (const user of users) {
      const attendance = user.createBlankAttendance(parade);
      await this.em.persist(attendance);
    }
    return this.em.flush();
  }

  @UseRequestContext()
  findAll() {
    return this.repository.findAll();
  }

  @UseRequestContext()
  async findOne(id: number) {
    const parade = await this.repository.findOne(id, {
      populate: ['attendances', 'attendances.user'],
    });
    return new FindOneParadeDto(parade);
  }

  @UseRequestContext()
  async update(id: number, dto: UpdateParadeDto) {
    const parade = await this.repository.findOne(id);
    wrap(parade).assign(dto);
    await this.em.flush();
    return parade;
  }

  @UseRequestContext()
  remove(id: number) {
    return this.repository.nativeDelete(id);
  }

  @UseRequestContext()
  getLatestOngoingParade(): Promise<Parade> {
    return this.repository.findOneOrFail(
      { endDate: null },
      {
        orderBy: { id: QueryOrder.DESC },
      },
    );
  }
}
