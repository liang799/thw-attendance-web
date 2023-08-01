import { Entity, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { ParadeRepository } from "../parade.repository";

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
