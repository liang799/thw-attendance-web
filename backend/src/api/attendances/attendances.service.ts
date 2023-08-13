import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { EntityManager } from "@mikro-orm/core";
import { AttendanceRepository } from "./attendance.repository";
import { Availability } from "./value-objects/Availability";
import { AttendanceStatus } from "./dto/attendance-status";
import { ParadesService } from "../parades/parades.service";
import { UsersService } from "../users/users.service";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { Attendance } from "./entities/attendance.entity";

@Injectable()
export class AttendancesService {
  constructor(
    private readonly repository: AttendanceRepository,
    private readonly em: EntityManager,
    private readonly paradeService: ParadesService,
    private readonly userService: UsersService
  ) {
  }

  async create(dto: CreateAttendanceDto): Promise<Attendance> {

    const user = await this.userService.findOne(dto.user);
    const parade = await this.paradeService.getLatestOngoingParade();
    const existingAttendance = await this.repository.findOne({ user: user, parade: parade });

    if (existingAttendance) throw new ForbiddenException("[Prohibited Action]: duplicate attendance is not allowed");

    let availability: Availability = new Availability();
    if (dto.availability == AttendanceStatus.DISPATCH) {
      availability = Availability.dispatchTo(dto.location);
    } else if (dto.availability == AttendanceStatus.NO_MC) {
      availability = Availability.noMC(dto.status);
    } else if (dto.availability == AttendanceStatus.MIGHT_HAVE_MC) {
      availability = Availability.mightHaveMc(dto.status);
    } else if (dto.availability == AttendanceStatus.ABSENT) {
      availability = Availability.absent(dto.status, new Date(dto.mcStartDate), new Date(dto.mcEndDate));
    }

    const attendance = user.submitAttendance(availability, parade);
    await this.em.persistAndFlush(attendance);
    return attendance;
  }

  findAll(): Promise<Attendance[]> {
    return this.repository.findAll({ populate: ["user", "availability", "parade"] });
  }

  findOne(id: number): Promise<Attendance> {
    return this.repository.findOne(id, { populate: ["user", "availability", "parade"] });
  }

  async update(id: number, dto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.repository.findOne(id);

    let availability: Availability = new Availability();
    if (dto.availability == AttendanceStatus.DISPATCH) {
      availability = Availability.dispatchTo(dto.location);
    } else if (dto.availability == AttendanceStatus.NO_MC) {
      availability = Availability.noMC(dto.status);
    } else if (dto.availability == AttendanceStatus.MIGHT_HAVE_MC) {
      availability = Availability.mightHaveMc(dto.status);
    } else if (dto.availability == AttendanceStatus.ABSENT) {
      availability = Availability.absent(dto.status, new Date(dto.mcStartDate), new Date(dto.mcEndDate));
    }

    attendance.availability = availability;

    await this.em.flush();
    return attendance;
  }

  remove(id: number): Promise<number> {
    return this.repository.nativeDelete(id);
  }
}
