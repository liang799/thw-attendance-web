import { Injectable } from '@nestjs/common';
import { CreateParadeDto } from './dto/create-parade.dto';
import { UpdateParadeDto } from './dto/update-parade.dto';
import { ParadeRepository } from './parade.repository';
import { MikroORM, QueryOrder, UseRequestContext, wrap } from '@mikro-orm/core';
import { Parade } from './entities/parade.entity';
import { FindOneParadeDto } from './dto/find-one-parade.dto';
import { User } from '../users/entities/user.entity';
import { EntityManager } from '@mikro-orm/mysql';

@Injectable()
export class ParadesService {
  constructor(
    private readonly repository: ParadeRepository,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {
  }

  @UseRequestContext()
  async create(dto: CreateParadeDto) {
    const parade = new Parade(new Date(dto.startDate));
    const users = await this.em.find(User, {});
    if (!users) return this.em.persistAndFlush(parade);
    for (const user of users) {
      const attendance = user.createBlankTemplateAttendance(parade);
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
      populate: ['attendances', 'attendances.user']
    });
    const connection = this.em.getConnection();
    const knex = connection.getKnex();
    const availabilitySummary = await knex
      .select('availability_status as status')
      .count('* as count')
      .from('attendance')
      .where('parade_id', parade.id)
      .groupBy('availability_status')
    return new FindOneParadeDto(parade, availabilitySummary);
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
