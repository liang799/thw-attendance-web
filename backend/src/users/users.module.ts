import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserRepository } from "./user.repostiory";
import { JwtModule } from "@nestjs/jwt";
import 'dotenv/config';

@Module({
  controllers: [UsersController],
  imports: [
    MikroOrmModule.forFeature({ entities: [User] }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    })
  ],
  providers: [UsersService, UserRepository],
  exports: [UsersService ]
})
export class UsersModule {
}
