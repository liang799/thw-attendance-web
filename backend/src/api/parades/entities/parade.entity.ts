import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ParadeRepository } from '../parade.repository';
import { Attendance } from '../../attendances/entities/attendance.entity';

@Entity({ customRepository: () => ParadeRepository })
export class Parade {
  @PrimaryKey()
  id!: number;

  @Property()
  startDate: Date;

  @Property({ nullable: true })
  endDate?: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.parade)
  attendances = new Collection<Attendance>(this);

  constructor(startDate: Date) {
    this.startDate = startDate;
  }

  startParade() {
    this.startDate = new Date();
  }

  endParade() {
    this.endDate = new Date();
  }
}
