import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import 'dotenv/config';

@Module({
  controllers: [UsersController],
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
