import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Auth } from "./entities/auth.entity";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  imports: [MikroOrmModule.forFeature({ entities: [Auth] })],
  providers: [AuthService]
})
export class AuthModule {
}
