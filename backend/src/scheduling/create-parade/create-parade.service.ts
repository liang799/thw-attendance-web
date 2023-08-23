import { Injectable } from '@nestjs/common';
import { ParadesService } from '../../api/parades/parades.service';
import { ParadeType } from '../../api/parades/type/ParadeType';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CreateParadeService {
  constructor(
    private readonly paradeService: ParadesService,
    ) {
  }

  @Cron('0 0 8 * * 1-5') // Cron job For 8:00 AM on Monday to Friday
  async createFirstParade() {
    const currentParade = await this.paradeService.getLatestOngoingParade();
    if (!currentParade) {
      await this.paradeService.create({ type: ParadeType.FIRST, startDate: (new Date()).toString() });
      return;
    }
    await this.paradeService.update(currentParade.id, {
      type: ParadeType.FIRST,
      startDate: (new Date()).toString()
    });
  }

  @Cron('30 13 * * 1-5') // Cron job For 1:30 PM on Monday to Friday
  async createMidParade() {
    const currentParade = await this.paradeService.getLatestOngoingParade();
    if (!currentParade) {
      await this.paradeService.create({ type: ParadeType.MID, startDate: (new Date()).toString() });
      return;
    }
    await this.paradeService.update(currentParade.id, {
      type: ParadeType.MID,
      startDate: (new Date()).toString()
    });
  }
}
