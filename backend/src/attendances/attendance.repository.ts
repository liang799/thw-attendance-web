import { Attendance } from "./entities/attendance.entity";
import { EntityRepository } from "@mikro-orm/mongodb";

export class AttendanceRepository extends EntityRepository<Attendance> {

}
