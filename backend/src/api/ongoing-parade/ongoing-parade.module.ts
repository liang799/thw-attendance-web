import { Module } from '@nestjs/common';
import { OngoingParadeService } from './ongoing-parade.service';
import { OngoingParadeController } from './ongoing-parade.controller';
import { ParadesModule } from '../parades/parades.module';
@Module({
  controllers: [OngoingParadeController],
  imports: [ParadesModule],
  providers: [OngoingParadeService],
})
export class OngoingParadeModule {}
