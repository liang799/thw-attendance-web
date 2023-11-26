import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ParadesService } from '../parades/parades.service';
import { AttendancesService } from '../attendances/attendances.service';
import { NotFoundError } from '@mikro-orm/core';

@Injectable()
export class OngoingParadeService {
  constructor(
    private readonly paradeService: ParadesService,
    private readonly attendanceService: AttendancesService,
  ) { }

  async getLatestOngoingParade() {
    try {
      const parade = await this.paradeService.getLatestOngoingParade();
      return parade;
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new HttpException("No ongoing Parade", HttpStatus.NO_CONTENT);
      }
      throw e;
    }
  }

  getLatestParadeUserAttendance(id: number) {
    return this.attendanceService.getLatestParadeUserAttendance(id);
  }
}
