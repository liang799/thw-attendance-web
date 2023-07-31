import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AvailabilityStatusesModule } from "./availability-statuses/availability-statuses.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    AvailabilityStatusesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
