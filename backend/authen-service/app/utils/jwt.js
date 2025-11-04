const jwt = require('jsonwebtoken');
const redisClient = require('../datasources/redis');

const ACCESS_TOKEN_EXPIRE = '15m'; // 15 phút
const REFRESH_TOKEN_EXPIRE = '7d'; // 7 ngày
const ACCESS_TOKEN_PREFIX = 'accessToken:';
const REFRESH_TOKEN_PREFIX = 'refreshToken:';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function storeToken(userId, role, accessToken, refreshToken) {
  if (accessToken) {
    await redisClient.set(
      ACCESS_TOKEN_PREFIX + userId,
      accessToken,
      { EX: 60 * 15 } // 15 phút
    );
  }
  if (refreshToken) {
    await redisClient.set(
      REFRESH_TOKEN_PREFIX + userId,
      refreshToken,
      { EX: 60 * 60 * 24 * 7 } // 7 ngày
    );
  }
}

async function deleteToken(userId) {
  await redisClient.del(ACCESS_TOKEN_PREFIX + userId);
  await redisClient.del(REFRESH_TOKEN_PREFIX + userId);
}

async function checkAcessToken(userId) {
  return redisClient.get(ACCESS_TOKEN_PREFIX + userId);
}

async function getRefreshTokenByUserId(userId) {
  return redisClient.get(REFRESH_TOKEN_PREFIX + userId);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  storeToken,
  deleteToken,
  checkAcessToken,
  getRefreshTokenByUserId,
};
