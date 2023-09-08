import { Module } from '@nestjs/common';
import { OngoingParadeService } from './ongoing-parade.service';
import { OngoingParadeController } from './ongoing-parade.controller';
import { ParadesModule } from '../parades/parades.module';
import { AttendancesModule } from '../attendances/attendances.module';
@Module({
  controllers: [OngoingParadeController],
  imports: [ParadesModule, AttendancesModule],
  providers: [OngoingParadeService],
})
export class OngoingParadeModule {}
