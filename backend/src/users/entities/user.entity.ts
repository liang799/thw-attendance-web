import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { UserRepository } from "../user.repostiory";
import { Attendance } from "../../attendances/entities/attendance.entity";
import { PersonnelType } from "../types/PersonnelType";
import { BranchType } from "../types/BranchType";

@Entity({
  customRepository: () => UserRepository,
  discriminatorColumn: "type",
  discriminatorValue: PersonnelType.MEN
})
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  rank: string;

  @Property()
  name: string;

  @Enum({ items: () => BranchType, nullable: true })
  branch?: BranchType;

  @Enum(() => PersonnelType)
  type!: PersonnelType;

  @OneToMany(() => Attendance, attendance => attendance.user)
  attendances = new Collection<Attendance>(this);

  constructor(rank: string, name: string) {
    this.rank = rank;
    this.name = name;
    this.type = PersonnelType.MEN;
  }
}
