import { Module } from '@nestjs/common';
import { ParadesService } from './parades.service';
import { ParadesController } from './parades.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Parade } from './entities/parade.entity';

@Module({
  controllers: [ParadesController],
  imports: [MikroOrmModule.forFeature({ entities: [Parade] })],
  providers: [ParadesService],
  exports: [ParadesService],
})
export class ParadesModule {}
