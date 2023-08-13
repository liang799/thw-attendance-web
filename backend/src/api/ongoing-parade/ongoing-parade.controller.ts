import { Controller, Get } from "@nestjs/common";
import { OngoingParadeService } from './ongoing-parade.service';
import { Public } from "../../constants";

@Controller('ongoing-parade')
export class OngoingParadeController {
  constructor(private readonly ongoingParadeService: OngoingParadeService) {}
  @Public()
  @Get()
  getLatestOngoingParade() {
    return this.ongoingParadeService.getLatestOngoingParade();
  }
}
