import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { githubAuthConfig } from '../app.constants';
import { User } from '../users/user.entity';
import { hashSync } from 'bcrypt';
import { randomStr } from '../common/util';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/create-user.dto';

export interface LoginForm {
  email: string;
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    schema: {
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('login/toGithub')
  @Redirect('https://github.com/login/oauth/authorize', 302)
  async redirectToGithub() {
    const redirectToGithubIdentityUrl = `https://github.com/login/oauth/authorize?client_id=${githubAuthConfig.client_id}&scope=${githubAuthConfig.scope}`;
    return {
      url: redirectToGithubIdentityUrl,
    };
  }

  /**
   * first use code exchange github access_token
   * and then login
   * @param code
   */
  @ApiParam({
    type: String,
    name: 'code',
    description: 'github code',
  })
  @Post('login/github/:code')
  async githubAuthCallback(@Param('code') code) {
    const token = await this.authService.getGithubAccessTokenByCode(code);

    const githubUser: any = await this.authService.getGithubUserInfoByToken(
      token,
    );

    console.log('githubUser=', githubUser);

    let user = await User.findOne({
      where: {
        email: githubUser.email,
        github: githubUser.id,
      },
    });

    if (!user) {
      user = await User.save(
        User.create({
          name: githubUser.name,
          email: githubUser.email,
          github: githubUser.id,
          password: hashSync(randomStr(), 3),
          createdAt: new Date(),
        }),
      );
    } else {
      // update user
      user.rememberToken = token;
      user.name = githubUser.name;
      user.email = githubUser.email;
      await User.save(user);
    }

    return this.authService.login(user);
  }
}
