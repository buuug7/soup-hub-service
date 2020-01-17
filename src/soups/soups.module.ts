import { Module } from '@nestjs/common';
import { SoupsController } from './soups.controller';
import { SoupsService } from './soups.service';

@Module({
  controllers: [SoupsController],
  providers: [SoupsService],
})
export class SoupsModule {}
