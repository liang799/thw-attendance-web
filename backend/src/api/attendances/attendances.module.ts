import { Module } from "@nestjs/common";
import { AttendancesService } from "./attendances.service";
import { AttendancesController } from "./attendances.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Attendance } from "./entities/attendance.entity";
import { ParadesModule } from "../parades/parades.module";
import { ParadeRepository } from "../parades/parade.repository";

@Module({
  controllers: [AttendancesController],
  imports: [MikroOrmModule.forFeature({ entities: [Attendance] }), ParadesModule],
  providers: [AttendancesService, ParadeRepository]
})
export class AttendancesModule {
}
