import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "../../users/entities/user.entity";
import { AvailabilityStatus } from "../../availability-statuses/entities/availability-status.entity";
import { Parade } from "../../parades/entities/parade.entity";
import { AttendanceRepository } from "../attendance.repository";

@Entity({ customRepository: () => AttendanceRepository })
export class Attendance {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  user!: User;

  @ManyToOne()
  availability!: AvailabilityStatus;

  @ManyToOne(() => Parade)
  parade!: Parade;

  @Property()
  submittedAt: Date = new Date();

  constructor(user: User, availability: AvailabilityStatus, parade: Parade) {
    this.user = user;
    this.availability = availability;
    this.parade = parade;
  }
}
