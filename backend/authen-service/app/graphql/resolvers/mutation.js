const authController = require('../../controllers/authController');
const { useGraphqlHandler } = require('../../utils');

module.exports = {
  loginPatient: async (_, { input }) => useGraphqlHandler('loginPatient', authController.loginPatient(input)),
  loginPhysician: async (_, { input }) => useGraphqlHandler('loginPhysician', authController.loginPhysician(input)),
  logout: async (_, { input }) => useGraphqlHandler('logout', authController.logout(input)),
  refreshToken: async (_, { input }) => useGraphqlHandler('refreshToken', authController.refreshToken(input)),
};
