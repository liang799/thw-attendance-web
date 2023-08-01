import { Module } from "@nestjs/common";
import { AvailabilityStatusesService } from "./availability-statuses.service";
import { AvailabilityStatusesController } from "./availability-statuses.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { AvailabilityStatus } from "./entities/availability-status.entity";

@Module({
  controllers: [AvailabilityStatusesController],
  imports: [MikroOrmModule.forFeature({ entities: [AvailabilityStatus] })],
  providers: [AvailabilityStatusesService]
})
export class AvailabilityStatusesModule {
}
