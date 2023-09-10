import {
  Embedded,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { Parade } from '../../parades/entities/parade.entity';
import { AttendanceRepository } from '../attendance.repository';
import { Availability, AvailabilityType } from '../value-objects/availability/Availability';

@Entity({ customRepository: () => AttendanceRepository })
export class Attendance {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Embedded(() => Availability)
  availability!: Availability;

  @ManyToOne(() => Parade)
  parade!: Parade;

  @Property()
  submittedAt: Date = new Date();

  isPresent(): boolean {
    return this.availability.type == AvailabilityType.PRESENT;
  }
}
