import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { UserRepository } from "../user.repostiory";
import { Attendance } from "../../attendances/entities/attendance.entity";

@Entity({ customRepository: () => UserRepository })
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  rank: string;

  @Property()
  name: string;

  @OneToMany(() => Attendance, attendance => attendance.user)
  attendances = new Collection<Attendance>(this);

  constructor(rank: string, name: string) {
    this.rank = rank;
    this.name = name;
  }
}
