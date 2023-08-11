import { Embeddable, Enum, Property } from "@mikro-orm/core";

export enum AvailabilityType {
  NO_MC = "No MC",
  DISPATCH = "Dispatch",
  MIGHT_HAVE_MC = "Might Have MC",
  ABSENT = "Absent"
}

@Embeddable()
export class Availability {
  @Property()
  status!: string;

  @Enum(() => AvailabilityType)
  type!: AvailabilityType;

  @Property()
  dispatchLocation?: string = null;

  @Property()
  mcStartDate?: Date = null;

  @Property()
  mcEndDate?: Date = null;

  static noMC(status: string) {
    const availability = new Availability();
    availability.type = AvailabilityType.NO_MC;
    availability.status = status;
    return availability;
  }

  static dispatchTo(location: string) {
    const availability = new Availability();
    availability.type = AvailabilityType.DISPATCH;
    availability.status = "Dispatch";
    availability.dispatchLocation = location;
    return availability;
  }

  static mightHaveMc(status: string) {
    const availability = new Availability();
    availability.type = AvailabilityType.MIGHT_HAVE_MC;
    availability.status = status;
    return availability;
  }

  static absent(status: string, start: Date, end: Date) {
    const availability = new Availability();
    availability.type = AvailabilityType.ABSENT;
    availability.status = status;
    availability.mcStartDate = start;
    availability.mcEndDate = end;
    return availability;
  }
}
