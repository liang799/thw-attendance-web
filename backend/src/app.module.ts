import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AvailabilityStatusesModule } from "./availability-statuses/availability-statuses.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ParadesModule } from "./parades/parades.module";
import { UsersModule } from "./users/users.module";
import { AttendancesModule } from "./attendances/attendances.module";
import 'dotenv/config';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      autoLoadEntities: true,
      entities: ["dist/src/**/*.entity.js"],
      entitiesTs: ["src/**/*.entity.ts"],
      dbName: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      type: "mysql"
    }),
    AvailabilityStatusesModule,
    ParadesModule,
    UsersModule,
    AttendancesModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
