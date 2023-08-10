import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { Attendance } from "../../attendances/entities/attendance.entity";
import { AvailabilityStatus } from "../../availability-statuses/entities/availability-status.entity";
import { Parade } from "../../parades/entities/parade.entity";
import { PersonnelType } from "../types/PersonnelType";
import { UserRepository } from "../user.repostiory";

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
