const { signAccessToken, signRefreshToken, storeToken, deleteToken, checkAcessToken, getRefreshTokenByUserId, verifyToken } = require('../utils/jwt');
const { Customer } = require('../datasources/mongodb');
const { Admin } = require('../datasources/mongodb');
const bcrypt = require('bcryptjs');
const { RESPONSE_CODE } = require('../constant');

async function loginCustomer({ email, password }) {
    const user = await Customer.findOne({ email });
    if (!user) return { code: RESPONSE_CODE.NOT_FOUND, isSuccess: false, message: 'Customer not found' };
    if (!await bcrypt.compare(password, user.password)) return { code: RESPONSE_CODE.INVALID_INPUT, isSuccess: false, message: 'Invalid password' };

    const payload = { id: user._id, role: 'CUSTOMER', email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await storeToken(user._id.toString(), 'CUSTOMER', accessToken, refreshToken);
    const userObj = { ...user.toObject(), id: user._id.toString(), role: 'CUSTOMER' };
    delete userObj._id;
    delete userObj.__v;
    return { code: RESPONSE_CODE.SUCCESS_MUTATION, isSuccess: true, message: 'Login successful', accessToken, refreshToken, user: userObj };
}

async function loginAdmin({ email, password }) {
    const user = await Admin.findOne({ email });
    if (!user) return { code: RESPONSE_CODE.NOT_FOUND, isSuccess: false, message: 'Admin not found' };
    if (!await bcrypt.compare(password, user.password)) return { code: RESPONSE_CODE.INVALID_INPUT, isSuccess: false, message: 'Invalid password' };
    const payload = { id: user._id, role: 'ADMIN', email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    await storeToken(user._id.toString(), 'ADMIN', accessToken, refreshToken);
    const userObj = { ...user.toObject(), id: user._id.toString(), role: 'ADMIN' };
    delete userObj._id;
    delete userObj.__v;
    return { code: RESPONSE_CODE.SUCCESS_MUTATION, isSuccess: true, message: 'Login successful', accessToken, refreshToken, user: userObj };
}

async function logout({ userId }) {
    let payload;
    try {
        payload = deleteToken(userId);
    } catch (e) {
        return { code: RESPONSE_CODE.UNAUTHORIZED, isSuccess: false, message: 'Invalid or expired access token.' };
    }
    await deleteToken(payload.id);
    return { code: RESPONSE_CODE.SUCCESS_MUTATION, isSuccess: true, message: 'Logged out' };
}

async function refreshTokenFn({ refreshToken }) {
    //jwt ktra
    let payload;
    try {
        payload = verifyToken(refreshToken);
    } catch (e) {
        return { code: RESPONSE_CODE.TOKEN_EXPIRED, isSuccess: false, message: 'Refresh token expired or invalid' };
    }

    //redis ktra
    const storedRefreshToken = await getRefreshTokenByUserId(payload.id);
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
        return { code: RESPONSE_CODE.UNAUTHORIZED, isSuccess: false, message: 'Invalid refresh token || refresh token deleted, login again !' };
    }

    // Loại bỏ 'exp' và 'iat' khỏi payload để signAccessToken có thể đặt lại expiresIn
    const newPayload = { id: payload.id, role: payload.role, email: payload.email }

    const newAccessToken = signAccessToken(newPayload);
    await storeToken(payload.id, payload.role, newAccessToken, refreshToken); // Lưu lại token mới, giữ refresh token cũ
    return { code: RESPONSE_CODE.SUCCESS_MUTATION, isSuccess: true, message: 'Token refreshed', accessToken: newAccessToken, refreshToken: refreshToken };
}

async function getMeInfo({ accessToken }) {
    console.log("getMeInfo accessToken: ", accessToken);
    let payload;
    try {
        payload = verifyToken(accessToken);
    } catch (e) {
        // accessToken hết hạn hoặc không hợp lệ -> throw để gateway trả GraphQL error
        throw new Error(JSON.stringify({
            code: RESPONSE_CODE.TOKEN_EXPIRED,
            message: 'Access token expired or invalid. Please refresh token.'
        }));
    }

    // accessToken còn hạn, check redis
    const storedAccessToken = await checkAcessToken(payload.id);
    if (!storedAccessToken || storedAccessToken !== accessToken) {
        // Token bị revoke/hết hạn theo Redis -> throw để client bắt qua errorLink
        throw new Error(JSON.stringify({
            code: RESPONSE_CODE.TOKEN_EXPIRED,
            message: 'Invalid access token or token already removed. Please refresh token.'
        }));
    }

    const refreshToken = await getRefreshTokenByUserId(payload.id);

    let user;
    if (payload.role === 'CUSTOMER') {
        user = await Customer.findById(payload.id);
    } else if (payload.role === 'ADMIN') {
        user = await Admin.findById(payload.id);
    }

    if (!user) {
        throw new Error(JSON.stringify({
            code: RESPONSE_CODE.NOT_FOUND,
            message: 'User not found'
        }));
    }
    let userObj = { ...user.toObject(), id: user._id.toString(), role: payload.role };
    delete userObj._id;
    delete userObj.__v;
    console.log("user: ", user);
    return { 
        code: RESPONSE_CODE.SUCCESS_QUERY, 
        isSuccess: true, 
        message: 'Get user info success', 
        accessToken, 
        refreshToken, 
        user: userObj,
    };
}

module.exports = {
  loginCustomer,
  loginAdmin,
  logout,
  refreshToken: refreshTokenFn,
  getMeInfo,
};
