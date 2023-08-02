import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { ParadeRepository } from "../parade.repository";
import { Attendance } from "../../attendances/entities/attendance.entity";
import { ParadeType } from "../type/ParadeType";

@Entity({ customRepository: () => ParadeRepository })
export class Parade {
  @PrimaryKey()
  id!: number;

  @Enum({ items: () => ParadeType })
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
