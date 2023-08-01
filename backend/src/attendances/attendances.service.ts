import { Injectable } from "@nestjs/common";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { EntityManager, wrap } from "@mikro-orm/core";
import { AttendanceRepository } from "./attendance.repository";
import { User } from "../users/entities/user.entity";
import { AvailabilityStatus } from "../availability-statuses/entities/availability-status.entity";
import { Parade } from "../parades/entities/parade.entity";
import { Attendance } from "./entities/attendance.entity";

@Injectable()
export class AttendancesService {
  constructor(
    private readonly repository: AttendanceRepository,
    private readonly em: EntityManager
  ) {
  }

  create(dto: CreateAttendanceDto) {
    const user = this.em.getReference(User, dto.user, { wrapped: true });
    const availability = this.em.getReference(AvailabilityStatus, dto.availability, { wrapped: true });
    const parade = this.em.getReference(Parade, dto.parade, { wrapped: true });
    const attendance = new Attendance(user, availability, parade);
    return this.em.persistAndFlush(attendance);
  }

  findAll() {
    return this.repository.findAll({ populate: ["user", "availability", "parade"] });
  }

  findOne(id: number) {
    return this.repository.findOne(id, { populate: ["user", "availability", "parade"] });
  }

  async update(id: number, dto: UpdateAttendanceDto) {
    const attendance = await this.repository.findOne(id);
    wrap(attendance).assign(dto);
    await this.em.flush();
    return attendance;
  }

  remove(id: number) {
    return this.repository.nativeDelete(id);
  }
}
