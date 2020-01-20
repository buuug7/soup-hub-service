import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import { githubAuthConfig } from '../app.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      console.log('user=', user);
      return user;
    }

    return null;
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
    };
  }

  /**
   * get github user access_token by code
   * @param code
   */
  async getGithubAccessTokenByCode(code: string) {
    const getAccessTokenUrl = 'https://github.com/login/oauth/access_token';
    const response = await fetch(getAccessTokenUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: githubAuthConfig.client_id,
        client_secret: githubAuthConfig.client_secret,
        code: code,
      }),
    });

    const json = await response.json();
    return json.access_token;
  }

  /**
   * get github user info by access_token
   * @param token
   */
  async getGithubUserInfoByToken(token: string) {
    const githubUser: any = await fetch(githubAuthConfig.user_info_url + token);
    return await githubUser.json();
  }
}
