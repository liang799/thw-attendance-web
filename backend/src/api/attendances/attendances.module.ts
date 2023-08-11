import { Module } from "@nestjs/common";
import { AttendancesService } from "./attendances.service";
import { AttendancesController } from "./attendances.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Attendance } from "./entities/attendance.entity";

@Module({
  controllers: [AttendancesController],
  imports: [MikroOrmModule.forFeature({ entities: [Attendance] })],
  providers: [AttendancesService]
})
export class AttendancesModule {
}
