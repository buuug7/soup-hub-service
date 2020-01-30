import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(
    @Body()
    body: CreateUserDto,
  ) {
    return this.userService.create(body);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body()
    body: CreateUserDto,
    @Req() req,
  ) {
    return this.userService.update(req.user.id, body);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req) {
    return this.userService.findOne(req.user.email);
  }

  @Get(':id/createdSoups')
  async getCreatedSoups(@Param('id') userId, @Query() queryParam) {
    return this.userService.getCreatedSoups(userId, queryParam);
  }

  @ApiParam({
    name: 'id',
    type: String,
    description: 'user id',
  })
  @Get(':id/starSoups')
  async getStarSoups(@Param('id') userId, @Query() queryParam) {
    return this.userService.getStarSoups(userId, queryParam);
  }

  @ApiParam({
    name: 'id',
    type: String,
    description: 'user id',
  })
  @Get(':id/starComments')
  async getStarComments(@Param('id') userId, @Query() queryParam) {
    return this.userService.getStarComments(userId, queryParam);
  }
}
