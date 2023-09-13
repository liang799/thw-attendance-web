import { Controller, Get, Param } from '@nestjs/common';
import { OngoingParadeService } from './ongoing-parade.service';

@Controller('ongoing-parade')
export class OngoingParadeController {
  constructor(private readonly ongoingParadeService: OngoingParadeService) {}

  @Get()
  getLatestOngoingParade() {
    return this.ongoingParadeService.getLatestOngoingParade();
  }

  @Get('users/:id/attendance')
  getLatestParadeUserAttendance(@Param('id') id: string) {
    return this.ongoingParadeService.getLatestParadeUserAttendance(+id);
  }
}
