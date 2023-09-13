import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ParadesModule } from './api/parades/parades.module';
import { UsersModule } from './api/users/users.module';
import { AttendancesModule } from './api/attendances/attendances.module';
import 'dotenv/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './api/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { OngoingParadeModule } from './api/ongoing-parade/ongoing-parade.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      autoLoadEntities: true,
      entities: ['dist/src/**/*.entity.js'],
      entitiesTs: ['src/**/*.entity.ts'],
      dbName: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      type: 'mysql',
      debug: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60 days' },
    }),
    ParadesModule,
    UsersModule,
    AttendancesModule,
    OngoingParadeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
