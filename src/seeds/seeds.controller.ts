import { Controller, Get } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('seeds')
@Controller('seeds')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Get('users')
  async seedUsers() {
    return await this.seedsService.seedUsers();
  }

  //
  // @Get('soups')
  // async seedSoups() {
  //   return await this.seedsService.seedSoups();
  // }

  @Get('seed')
  async seed() {
    return await this.seedsService.seeds();
  }
}
