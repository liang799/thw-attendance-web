import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AvailabilityStatusesModule } from "./availability-statuses/availability-statuses.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";

@Module({
  imports: [
    MikroOrmModule.forRoot({ autoLoadEntities: true, entitiesTs: ["src/**/*.entity.ts"], dbName: "attendance", type: "mongo" }),
    AvailabilityStatusesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
