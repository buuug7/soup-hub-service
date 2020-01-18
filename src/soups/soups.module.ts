import { Module } from '@nestjs/common';
import { SoupsController } from './soups.controller';
import { SoupsService } from './soups.service';
import { CommentsModule } from '../comments/comments.module';
import { CommentsService } from '../comments/comments.service';

@Module({
  imports: [CommentsModule],
  controllers: [SoupsController],
  providers: [SoupsService],
})
export class SoupsModule {}
