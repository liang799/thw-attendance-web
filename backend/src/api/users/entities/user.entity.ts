import { Entity, Enum, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Attendance } from "../../attendances/entities/attendance.entity";
import { Parade } from "../../parades/entities/parade.entity";
import { PersonnelType } from "../types/PersonnelType";
import { UserRepository } from "../user.repostiory";
import { Availability } from "../../attendances/value-objects/Availability";

@Entity({
  discriminatorColumn: "type",
  discriminatorValue: PersonnelType.MEN,
  customRepository: () => UserRepository,
})
export class User {
  @PrimaryKey()
  id!: number;

  @Enum(() => PersonnelType)
  type!: PersonnelType;

  @Property({ nullable: true })
  rank?: string;

  @Property({ nullable: true })
  name?: string;

  @Property()
  @Unique()
  email: string;

  @Property()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  submitAttendance(availability: Availability, parade: Parade): Attendance {
    const attendance = new Attendance();
    attendance.user = this;
    attendance.availability = availability;
    attendance.parade = parade;
    return attendance;
  }
}