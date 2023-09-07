import { Attendance } from '../../attendances/entities/attendance.entity';
import { Parade } from '../entities/parade.entity';
import { BranchType } from '../../users/types/BranchType';

interface availabilityCount {
  status: string,
  count: number,
}

export class FindOneParadeDto {
  id: number;

  startDate: Date;

  endDate?: Date;

  attendances: Attendance[];

  summary: availabilityCount[]

  constructor(parade: Parade, availabilitySummary: availabilityCount[]) {
    this.id = parade.id;
    this.startDate = parade.startDate;
    this.endDate = parade.endDate;
    const rawAttendances = parade.attendances.getItems();
    this.attendances = this.sortPeople(rawAttendances);
    this.summary = availabilitySummary;
  }

  private sortPeople(attendances: Attendance[]): Attendance[] {
    const branchesPriority: Record<string, number> = {};

    branchesPriority[BranchType.COMMANDER] = 0;
    branchesPriority[BranchType.S1] = 1;
    branchesPriority[BranchType.S3] = 2;
    branchesPriority[BranchType.S4] = 4;
    branchesPriority[BranchType.TRANSITION] = 5;

    return attendances.sort((a, b) => {
      return branchesPriority[a.user.type] - branchesPriority[b.user.type]
    })
  }
}
