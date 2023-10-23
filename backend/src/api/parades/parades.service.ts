import { ConflictException, Injectable } from '@nestjs/common';
import { CreateParadeDto } from './dto/create-parade.dto';
import { UpdateParadeDto } from './dto/update-parade.dto';
import { ParadeRepository } from './parade.repository';
import { MikroORM, QueryOrder, UseRequestContext, wrap } from '@mikro-orm/core';
import { Parade } from './entities/parade.entity';
import { FindOneParadeDto } from './dto/find-one-parade.dto';
import { User } from '../users/entities/user.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { Attendance } from '../attendances/entities/attendance.entity';
import { DateTime } from 'luxon';
import { Availability } from '../attendances/value-objects/availability/Availability';

@Injectable()
export class ParadesService {
  constructor(
    private readonly repository: ParadeRepository,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) { }

  @UseRequestContext()
  async create(dto: CreateParadeDto) {
    const ongoingParade = await this.repository.findOne({ endDate: null });
    if (ongoingParade) throw new ConflictException();

    const parade = new Parade(new Date(dto.startDate));
    await this.em.persist(parade);

    const prevParade = await this.repository.findOne(
      { endDate: { $ne: null } },
      {
        orderBy: { id: QueryOrder.DESC },
        populate: ['attendances', 'attendances.user'],
      },
    );


    if (prevParade) {
      const attendances = prevParade.attendances
        .filter(prevAttendance => !prevAttendance.user.hasLeftNode)

      const users = await this.em.find(User, { hasLeftNode: false });
      users
        .filter(user => {
          const hasUser = attendances.some(prevAttendance => prevAttendance.user.id === user.id);
          const isNewUser = !hasUser;
          return isNewUser;
        })
        .forEach(async (user) => {
          const attendance = user.createBlankTemplateAttendance(parade);
          attendance.user = user;
          await this.em.persist(attendance);
        });

      attendances.forEach(async (prevAttendance) => {
        const absentEndDate = prevAttendance.availability.absentEndDate;
        const paradeDate = DateTime.fromISO(dto.startDate);
        const endDate = DateTime.fromJSDate(absentEndDate);
        if (!absentEndDate || endDate < paradeDate) {
          const user = prevAttendance.user;
          const attendance = user.createBlankTemplateAttendance(parade);
          await this.em.persist(attendance);
          return;
        }
        const attendance = new Attendance();
        attendance.availability = prevAttendance.availability;
        attendance.parade = parade;
        attendance.user = prevAttendance.user;
        await this.em.persist(attendance);
      });

      return this.em.flush();
    }

    const users = await this.em.find(User, {});
    if (!users) return this.em.persistAndFlush(parade);
    for (const user of users) {
      if (user.hasLeftNode) continue;
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
      populate: ['attendances', 'attendances.user'],
    });
    const connection = this.em.getConnection();
    const knex = connection.getKnex();
    const availabilitySummary = await knex
      .select('availability_status as status')
      .count('* as count')
      .from('attendance')
      .where('parade_id', parade.id)
      .groupBy('availability_status');
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
