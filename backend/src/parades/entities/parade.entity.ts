import { Collection, Entity, OneToMany, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { ParadeRepository } from "../parade.repository";
import { Attendance } from "../../attendances/entities/attendance.entity";

@Entity({ customRepository: () => ParadeRepository })
export class Parade {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  type: ParadeType;

  @Property()
  startDate: Date;

  @Property({ nullable: true })
  endDate?: Date;

  @OneToMany(() => Attendance, attendance => attendance.parade)
  attendances = new Collection<Attendance>(this);

  constructor(type: ParadeType, startDate: Date) {
    this.type = type;
    this.startDate = startDate;
  }
}

export enum ParadeType {
  FIRST = "First Parade",
  MID = "Mid Parade",
  LAST = "Last Parade"
}
