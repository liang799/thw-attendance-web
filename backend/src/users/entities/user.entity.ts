import { Entity, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { UserRepository } from "../user.repostiory";
import { ObjectId } from "@mikro-orm/mongodb";

@Entity({ customRepository: () => UserRepository })
export class User {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  rank: string;

  @Property()
  name: string;

  constructor(rank: string, name: string) {
    this.rank = rank;
    this.name = name;
  }
}
