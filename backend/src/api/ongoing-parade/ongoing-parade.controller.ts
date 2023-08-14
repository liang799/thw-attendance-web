import { Controller, Get } from '@nestjs/common';
import { OngoingParadeService } from './ongoing-parade.service';

@Controller('ongoing-parade')
export class OngoingParadeController {
  constructor(private readonly ongoingParadeService: OngoingParadeService) {}
  @Get()
  getLatestOngoingParade() {
    return this.ongoingParadeService.getLatestOngoingParade();
  }
}
