const authController = require('../../controllers/authController');
const { useGraphqlHandler } = require('../../utils');

module.exports = {
  loginCustomer: async (_, { input }) => useGraphqlHandler('loginCustomer', authController.loginCustomer(input)),
  loginAdmin: async (_, { input }) => useGraphqlHandler('loginAdmin', authController.loginAdmin(input)),
  logout: async (_, { input }) => useGraphqlHandler('logout', authController.logout(input)),
  refreshToken: async (_, { input }) => useGraphqlHandler('refreshToken', authController.refreshToken(input)),
};
