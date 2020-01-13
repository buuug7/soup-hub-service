import jsonWebToken = require('jsonwebtoken');

// @ts-ignore
/**
 * return JWT token
 * @param {{name:string,email:string,id:number}} user
 * @return {*}
 */
function signAuthToken(user) {
  return jsonWebToken.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      name: user.name,
      email: user.email,
      id: user.id,
    },
    process.env.APP_KEY,
  );
}

/**
 * Random string
 * @return {string}
 */
function randomStr() {
  return Math.random()
    .toString(36)
    .substr(2);
}

export { signAuthToken, randomStr };
