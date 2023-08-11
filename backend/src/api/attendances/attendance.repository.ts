import { Attendance } from "./entities/attendance.entity";
import { EntityRepository } from "@mikro-orm/mysql";

export class AttendanceRepository extends EntityRepository<Attendance> {

}
