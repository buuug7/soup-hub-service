export const jwtConstants = {
  secret: 'secretKey',
};

export const githubAuthConfig = {
  client_id: '0f3084d998f318ee4289',
  client_secret: 'ca5d9f5509b4388c8fb6c36bfdb7376b157505da',
  redirect_uri: 'http://localhost:3000/auth/login/github/callback',
  scope: 'user',
  user_info_url: 'https://api.github.com/user?access_token=',
};
