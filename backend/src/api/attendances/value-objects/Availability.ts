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
  mcStartDate?: Date;

  @Property({ nullable: true })
  mcEndDate?: Date;

  static noMC(status: string) {
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

  static mightHaveMc(status: string) {
    const availability = new Availability();
    availability.type = AvailabilityType.ABSENT;
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

  static unknown() {
    const availability = new Availability();
    availability.type = AvailabilityType.ABSENT;
    availability.status = '';
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
