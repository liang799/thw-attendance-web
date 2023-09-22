import { Attendance } from '../../attendances/entities/attendance.entity';
import { Parade } from '../entities/parade.entity';
import { UserType } from '../../users/types/UserType';

interface availabilityCount {
  status: string;
  count: number;
}

export class FindOneParadeDto {
  id: number;

  startDate: Date;

  endDate?: Date;

  attendances: Attendance[];

  summary: availabilityCount[];

  strength: Strength[];

  constructor(parade: Parade, availabilitySummary: availabilityCount[]) {
    this.id = parade.id;
    this.startDate = parade.startDate;
    this.endDate = parade.endDate;
    const rawAttendances = parade.attendances.getItems();
    this.attendances = this.sortPeople(rawAttendances);
    this.summary = availabilitySummary;
    this.strength = this.calcStrength(this.attendances);
  }

  private sortPeople(attendances: Attendance[]): Attendance[] {
    const branchesPriority: Record<string, number> = {};

    branchesPriority[UserType.COMMANDER] = 0;
    branchesPriority[UserType.S1] = 1;
    branchesPriority[UserType.S3] = 2;
    branchesPriority[UserType.S4] = 4;
    branchesPriority[UserType.MEDIA] = 5;
    branchesPriority[UserType.TRANSITION] = 6;

    return attendances.sort((a, b) => {
      return branchesPriority[a.user.type] - branchesPriority[b.user.type];
    });
  }

  private calcStrength(attendances: Attendance[]): Strength[] {
    return Object.values(UserType).map((value: UserType) => {
      const filtered = attendances.filter(
        (attendance) => attendance.user.type == value,
      );
      return new Strength(filtered, value);
    });
  }
}

class Strength {
  private readonly attendances: Attendance[];
  private type: UserType;
  private readonly present: number;
  private readonly total: number;

  constructor(filteredAttendances: Attendance[], type: UserType) {
    this.attendances = filteredAttendances;
    this.present = this.calcPresent();
    this.total = this.calcTotalAttendances();
    this.type = type;
  }

  calcTotalAttendances() {
    return this.attendances.length;
  }

  calcPresent() {
    let present = 0;
    for (const attendance of this.attendances) {
      if (!attendance.isPresent()) continue;
      ++present;
    }
    return present;
  }

  toJSON() {
    return {
      type: this.type,
      present: this.present,
      total: this.total,
    };
  }
}
