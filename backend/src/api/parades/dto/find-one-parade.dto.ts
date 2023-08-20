import { ParadeType } from '../type/ParadeType';
import { Attendance } from '../../attendances/entities/attendance.entity';
import { Parade } from '../entities/parade.entity';

export class FindOneParadeDto {
  id: number;

  type: ParadeType;

  startDate: Date;

  endDate?: Date;

  attendances: Attendance[];

  summary: Record<string, number>;

  constructor(parade: Parade) {
    this.id = parade.id;
    this.type = parade.type;
    this.startDate = parade.startDate;
    this.endDate = parade.endDate;
    this.attendances = parade.attendances.getItems();
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
}