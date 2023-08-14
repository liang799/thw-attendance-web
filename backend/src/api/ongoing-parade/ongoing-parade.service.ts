import { Injectable } from '@nestjs/common';
import { ParadesService } from '../parades/parades.service';

@Injectable()
export class OngoingParadeService {
  constructor(private readonly paradeService: ParadesService) {}

  getLatestOngoingParade() {
    return this.paradeService.getLatestOngoingParade();
  }
}
