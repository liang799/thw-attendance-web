import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { AvailabilityStatusesRepository } from "../availability-statuses.repository";

@Entity({ customRepository: () => AvailabilityStatusesRepository })
export class AvailabilityStatus {
  @PrimaryKey()
  id!: number;

  @Property()
  status: string;

  @Enum({ items: () => Availability })
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
