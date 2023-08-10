import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { PersonnelType } from "./PersonnelType";
import { Attendance } from "../../attendances/entities/attendance.entity";
import { AvailabilityStatus } from "../../availability-statuses/entities/availability-status.entity";
import { Parade } from "../../parades/entities/parade.entity";

@Entity({
  discriminatorColumn: "type"
})
export class User {
  @PrimaryKey()
  id!: number;

  @Enum()
  type!: PersonnelType;

  @Property()
  rank: string;

  @Property()
  name: string;

  @Property()
  email: string;

  @Property()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  submitAttendance(availability: AvailabilityStatus, parade: Parade): Attendance {
    // @ts-ignore
    return new Attendance(this, availability, parade);
  }
}
