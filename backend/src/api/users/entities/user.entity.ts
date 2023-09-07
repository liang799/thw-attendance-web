import { Entity, Enum, Index, PrimaryKey, Property } from "@mikro-orm/core";
import { Attendance } from '../../attendances/entities/attendance.entity';
import { Parade } from '../../parades/entities/parade.entity';
import { UserRepository } from '../user.repostiory';
import { Availability } from '../../attendances/value-objects/availability/Availability';
import { BranchType } from "../types/BranchType";

@Entity({
  customRepository: () => UserRepository,
})
export class User {
  @PrimaryKey()
  id!: number;

  @Enum(() => BranchType)
  @Index()
  type!: BranchType;

  @Property()
  rank: string;

  @Property()
  name: string;

  submitAttendance(availability: Availability, parade: Parade): Attendance {
    const attendance = new Attendance();
    attendance.user = this;
    attendance.availability = availability;
    attendance.parade = parade;
    return attendance;
  }

  createBlankTemplateAttendance(parade: Parade): Attendance {
    const attendance = new Attendance();
    attendance.user = this;
    attendance.availability = Availability.unknown();
    attendance.parade = parade;
    return attendance;
  }
}
