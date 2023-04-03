import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperModule } from 'src/Helper/helper.module';
import { PosterController } from './poster.controller';
import { Poster } from './poster.entity';
import { PosterService } from './poster.service';

@Module({
  imports: [TypeOrmModule.forFeature([Poster]), HelperModule],
  controllers: [PosterController],
  providers: [PosterService],
})
export class PosterModule {}
