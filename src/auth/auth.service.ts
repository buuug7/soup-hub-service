import { HttpService, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { githubAuthConfig } from '../app.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (user && compareSync(password, user.password)) {
      console.log('user=', user);
      return user;
    }

    return null;
  }

  async login(user: any) {
    return {
      token: this.jwtService.sign({
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
    const rs = await this.httpService
      .post(
        getAccessTokenUrl,
        JSON.stringify({
          client_id: githubAuthConfig.client_id,
          client_secret: githubAuthConfig.client_secret,
          code: code,
        }),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .toPromise();

    return rs.data.access_token;
  }

  /**
   * get github user info by access_token
   * @param token
   */
  async getGithubUserInfoByToken(token: string) {
    const rs = await this.httpService
      .get(githubAuthConfig.user_info_url + token)
      .toPromise();

    return await rs.data;
  }
}
