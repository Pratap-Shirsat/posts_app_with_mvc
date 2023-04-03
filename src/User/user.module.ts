import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperModule } from 'src/Helper/helper.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HelperModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
