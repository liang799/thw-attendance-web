import { Injectable } from '@nestjs/common';
import { ParadesService } from '../parades/parades.service';
import { AttendancesService } from '../attendances/attendances.service';

@Injectable()
export class OngoingParadeService {
  constructor(
    private readonly paradeService: ParadesService,
    private readonly attendanceService: AttendancesService,
  ) {}

  getLatestOngoingParade() {
    return this.paradeService.getLatestOngoingParade();
  }

  getLatestParadeUserAttendance(id: number) {
    return this.attendanceService.getLatestParadeUserAttendance(id);
  }
}
