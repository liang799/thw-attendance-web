import { Module } from '@nestjs/common';
import { CreateParadeService } from './create-parade.service';
import { ParadesModule } from '../../api/parades/parades.module';

@Module({
  providers: [CreateParadeService],
  imports: [ParadesModule],
})
export class CreateParadeModule {}
