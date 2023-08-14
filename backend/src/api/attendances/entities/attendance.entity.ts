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
import { Availability } from '../value-objects/Availability';

@Entity({ customRepository: () => AttendanceRepository })
export class Attendance {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  user!: User;

  @Embedded(() => Availability)
  availability!: Availability;

  @ManyToOne(() => Parade)
  parade!: Parade;

  @Property()
  submittedAt: Date = new Date();
}
