import { Injectable } from "@nestjs/common";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { EntityManager, wrap } from "@mikro-orm/core";
import { AttendanceRepository } from "./attendance.repository";
import { User } from "../users/entities/user.entity";
import { Availability, AvailabilityType } from "./value-objects/Availability";
import { Parade } from "../parades/entities/parade.entity";

@Injectable()
export class AttendancesService {
  constructor(
    private readonly repository: AttendanceRepository,
    private readonly em: EntityManager
  ) {
  }

  create(dto: CreateAttendanceDto) {
    const user = this.em.getReference(User, dto.user, { wrapped: true });
    let availability: Availability;
    if (dto.availability == AvailabilityType.DISPATCH) {
      availability = Availability.dispatchTo(dto.location);
    } else if (dto.availability == AvailabilityType.NO_MC) {
      availability = Availability.noMC(dto.status);
    } else if (dto.availability == AvailabilityType.MIGHT_HAVE_MC) {
      availability = Availability.mightHaveMc(dto.status);
    } else if (dto.availability == AvailabilityType.ABSENT) {
      availability = Availability.absent(dto.status, new Date(dto.mcStartDate), new Date(dto.mcEndDate));
    }
    const parade = this.em.getReference(Parade, dto.parade, { wrapped: true });
    const attendance = user.submitAttendance(availability, parade);
    return this.em.persistAndFlush(attendance);
  }

  findAll() {
    return this.repository.findAll({ populate: ["user", "availability", "parade"] });
  }

  findOne(id: number) {
    return this.repository.findOne(id, { populate: ["user", "availability", "parade"] });
  }

  // async update(id: number, dto: UpdateAttendanceDto) {
  //   const attendance = await this.repository.findOne(id);
  //   wrap(attendance).assign(dto);
  //   await this.em.flush();
  //   return attendance;
  // }

  remove(id: number) {
    return this.repository.nativeDelete(id);
  }
}
