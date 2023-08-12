import { Injectable } from "@nestjs/common";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { EntityManager, wrap } from "@mikro-orm/core";
import { AttendanceRepository } from "./attendance.repository";
import { User } from "../users/entities/user.entity";
import { Availability } from "./value-objects/Availability";
import { Parade } from "../parades/entities/parade.entity";
import { AttendanceStatus } from "./dto/attendance-status";
import { ParadeRepository } from "../parades/parade.repository";
import { ParadesService } from "../parades/parades.service";

@Injectable()
export class AttendancesService {
  constructor(
    private readonly repository: AttendanceRepository,
    private readonly em: EntityManager,
    private readonly paradeService: ParadesService
  ) {
  }

  async create(dto: CreateAttendanceDto) {
    const user = await this.em.findOne(User, { id: dto.user });
    let availability: Availability;
    if (dto.availability == AttendanceStatus.DISPATCH) {
      availability = Availability.dispatchTo(dto.location);
    } else if (dto.availability == AttendanceStatus.NO_MC) {
      availability = Availability.noMC(dto.status);
    } else if (dto.availability == AttendanceStatus.MIGHT_HAVE_MC) {
      availability = Availability.mightHaveMc(dto.status);
    } else if (dto.availability == AttendanceStatus.ABSENT) {
      availability = Availability.absent(dto.status, new Date(dto.mcStartDate), new Date(dto.mcEndDate));
    }
    const parade = await this.paradeService.getOngoingParade();
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
