import { Injectable, Logger } from '@nestjs/common';
import { ParadesService } from '../../api/parades/parades.service';
import { ParadeType } from '../../api/parades/type/ParadeType';
import { Cron } from '@nestjs/schedule';
import { UpdateParadeDto } from '../../api/parades/dto/update-parade.dto';

/* These does not work on serverless deployments */
@Injectable()
export class CreateParadeService {
  constructor(
    private readonly paradeService: ParadesService,
  ) {
  }
  private readonly logger = new Logger(CreateParadeService.name);

  @Cron('0 0 8 * * 1-5', {
    name: 'First Parade',
    timeZone: 'Asia/Singapore',
  }) // Cron job For 8:00 AM on Monday to Friday
  async createFirstParade() {
    this.logger.debug("Started First Parade Cron Job")
    const currentParade = await this.paradeService.getLatestOngoingParade();
    if (!currentParade) {
      await this.paradeService.create({ type: ParadeType.FIRST, startDate: (new Date()).toString() });
      this.logger.debug("Created First Parade!")
      return;
    }
    await this.paradeService.update(currentParade.id, UpdateParadeDto.firstParade());
    this.logger.debug("Updated First Parade!")
  }

  @Cron('30 13 * * 1-5', {
    name: 'Mid Parade',
    timeZone: 'Asia/Singapore',
  }) // Cron job For 1:30 PM on Monday to Friday
  async createMidParade() {
    this.logger.debug("Started Mid Parade Cron Job")
    const currentParade = await this.paradeService.getLatestOngoingParade();
    if (!currentParade) {
      await this.paradeService.create({ type: ParadeType.MID, startDate: (new Date()).toString() });
      this.logger.debug("Created Mid Parade!")
      return;
    }
    await this.paradeService.update(currentParade.id, UpdateParadeDto.midParade());
    this.logger.debug("Updated Mid Parade!")
  }
}
