import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UserCreate } from './users.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(
    @Body()
    body: UserCreate,
  ) {
    console.log('body=', body);
    return this.userService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req) {
    return req.user;
  }

  @Get(':id/starSoups')
  async getStarSoups(@Param('id') userId, @Query() queryParam) {
    return this.userService.getStarSoups(userId, queryParam);
  }

  @Get(':id/starComments')
  async getStarComments(@Param('id') userId, @Query() queryParam) {
    return this.userService.getStarComments(userId, queryParam);
  }
}
