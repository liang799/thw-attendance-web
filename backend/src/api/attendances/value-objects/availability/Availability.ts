import { Embeddable, Enum, Property } from '@mikro-orm/core';

export enum AvailabilityType {
  PRESENT = 'Present',
  ABSENT = 'Absent',
}

@Embeddable()
export class Availability {
  @Property()
  status!: string;

  @Enum(() => AvailabilityType)
  type!: AvailabilityType;

  @Property({ nullable: true })
  dispatchLocation?: string;

  @Property({ nullable: true })
  absentStartDate?: Date;

  @Property({ nullable: true })
  absentEndDate?: Date;

  static willBeInCamp(status: string) {
    const availability = new Availability();
    availability.type = AvailabilityType.PRESENT;
    availability.status = status;
    return availability;
  }

  static dispatchTo(location: string) {
    const availability = new Availability();
    availability.type = AvailabilityType.PRESENT;
    availability.status = 'Dispatch';
    availability.dispatchLocation = location;
    return availability;
  }

  static seeDoctor(status: string) {
    const availability = new Availability();
    availability.type = AvailabilityType.ABSENT;
    availability.status = status;
    return availability;
  }

  static absent(status: string, start: Date, end: Date) {
    const availability = new Availability();
    availability.type = AvailabilityType.ABSENT;
    availability.status = status;
    availability.absentStartDate = start;
    availability.absentEndDate = end;
    return availability;
  }

  static workFromHome() {
    const availability = new Availability();
    availability.type = AvailabilityType.PRESENT;
    availability.status = 'Work From Home';
    return availability;
  }

  static unknown() {
    const availability = new Availability();
    availability.type = AvailabilityType.ABSENT;
    availability.status = ''; // Not sure if I should use `NULL` instead
    return availability;
  }

  toJSON() {
    const filteredProperties: Record<string, any> = {};

    for (const [key, value] of Object.entries(this)) {
      if (value !== null && value !== undefined) {
        filteredProperties[key] = value;
      }
    }

    return filteredProperties;
  }
}
