import { Entity, OneToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { User } from "../../users/entities/user.entity";
import { AuthRepository } from "../auth.repository";

@Entity({
  customRepository: () => AuthRepository
})
export class Auth {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  username: string;

  @Property()
  password: string;

  @OneToOne({ nullable: true })
  user?: User;
}
