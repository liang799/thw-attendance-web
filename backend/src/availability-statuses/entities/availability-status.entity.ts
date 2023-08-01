import { ObjectId } from "@mikro-orm/mongodb";
import { Entity, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { AvailabilityStatusesRepository } from "../availability-statuses.repository";

@Entity({ customRepository: () => AvailabilityStatusesRepository })
export class AvailabilityStatus {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  status: string;

  @Property()
  availability: Availability;

  constructor(status: string, availability: Availability) {
    this.status = status;
    this.availability = availability;
  }
}
export enum Availability {
  IN_CAMP = "In Camp",
  NOT_IN_CAMP = "Not In Camp"
}
