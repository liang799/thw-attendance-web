import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { EntityManager, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { AttendanceRepository } from './attendance.repository';
import { ParadesService } from '../parades/parades.service';
import { UsersService } from '../users/users.service';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import AvailabilityFactory from './value-objects/availability/AvailabilityFactory';

@Injectable()
export class AttendancesService {
  constructor(
    private readonly repository: AttendanceRepository,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,
    private readonly paradeService: ParadesService,
    private readonly userService: UsersService,
  ) {}

  @UseRequestContext()
  async create(dto: CreateAttendanceDto): Promise<Attendance> {
    const user = await this.userService.findOne(dto.user);
    const parade = await this.paradeService.getLatestOngoingParade();

    const factory = new AvailabilityFactory();
    const availability = factory.createAvailability(dto);

    const existingAttendance = await this.repository.findOne({
      user: user,
      parade: parade,
    });

    if (existingAttendance) {
      existingAttendance.availability = availability;
      await this.em.flush();
      return existingAttendance;
    }

    const attendance = user.submitAttendance(availability, parade);
    await this.em.persistAndFlush(attendance);
    return attendance;
  }

  @UseRequestContext()
  findAll(): Promise<Attendance[]> {
    return this.repository.findAll({
      populate: ['user', 'availability', 'parade'],
    });
  }

  @UseRequestContext()
  findOne(id: number): Promise<Attendance> {
    return this.repository.findOne(id, {
      populate: ['user', 'availability', 'parade'],
    });
  }

  @UseRequestContext()
  async update(id: number, dto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.repository.findOne(id);
    if (!attendance) throw new NotFoundException();

    const factory = new AvailabilityFactory();
    attendance.availability = factory.createAvailability(dto);

    await this.em.flush();
    return attendance;
  }

  @UseRequestContext()
  async remove(id: number): Promise<void> {
    const attendance = await this.repository.findOne(id);
    if (!attendance) throw new NotFoundException();
    return this.em.remove(attendance).flush();
  }

  async getLatestParadeUserAttendance(id: number) {
    const parade = await this.paradeService.getLatestOngoingParade();
    const user = await this.userService.findOne(id);
    return this.repository.findOne({ user: user, parade: parade });
  }
}
