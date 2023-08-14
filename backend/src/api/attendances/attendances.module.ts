import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Attendance } from './entities/attendance.entity';
import { ParadesModule } from '../parades/parades.module';
import { ParadeRepository } from '../parades/parade.repository';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AttendancesController],
  imports: [
    MikroOrmModule.forFeature({ entities: [Attendance] }),
    ParadesModule,
    UsersModule,
  ],
  providers: [AttendancesService, ParadeRepository],
})
export class AttendancesModule {}
