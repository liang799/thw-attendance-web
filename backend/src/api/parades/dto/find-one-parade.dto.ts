import { Attendance } from '../../attendances/entities/attendance.entity';
import { Parade } from '../entities/parade.entity';
import { BranchType } from '../../users/types/BranchType';

export class FindOneParadeDto {
  id: number;

  startDate: Date;

  endDate?: Date;

  attendances: Attendance[];

  summary: Record<string, number>;

  constructor(parade: Parade) {
    this.id = parade.id;
    this.startDate = parade.startDate;
    this.endDate = parade.endDate;
    const rawAttendances = parade.attendances.getItems();
    this.attendances = this.sortPeople(rawAttendances);
    this.summary = this.tallyAttendance(this.attendances)
  }

  private tallyAttendance(attendances: Attendance[]): Record<string, number> {
    const summary: Record<string, number> = {};

    for (const attendance of attendances) {
      const status = attendance.availability.status;
      summary[status] = (summary[status] || 0) + 1;
    }

    return summary;
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
