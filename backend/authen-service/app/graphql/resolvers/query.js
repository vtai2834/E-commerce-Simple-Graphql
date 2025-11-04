const authController = require('../../controllers/authController');
const { useGraphqlHandler } = require('../../utils');

module.exports = {
  getMeInfo: async (_, __, context) => {
    console.log("context in getMeInfo: ", context);
    const accessToken = context.token.replace('Bearer ', '');
    console.log("token: ", accessToken);
    return useGraphqlHandler('getMeInfo', authController.getMeInfo({ accessToken }));
  },
};
