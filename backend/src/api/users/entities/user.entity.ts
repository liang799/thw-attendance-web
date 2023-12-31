import { Entity, Enum, Index, PrimaryKey, Property } from '@mikro-orm/core';
import { Attendance } from '../../attendances/entities/attendance.entity';
import { Parade } from '../../parades/entities/parade.entity';
import { UserRepository } from '../user.repostiory';
import { Availability } from '../../attendances/value-objects/availability/Availability';
import { UserType } from '../types/UserType';

@Entity({
  customRepository: () => UserRepository,
})
export class User {
  @PrimaryKey()
  id!: number;

  @Enum(() => UserType)
  @Index()
  type!: UserType;

  @Property()
  rank: string;

  @Property()
  name: string;

  @Property()
  hasLeftNode: boolean = false;

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
