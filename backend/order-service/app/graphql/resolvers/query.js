const { getOrders } = require('../../controllers');
const { useGraphqlHandler } = require('../../utils');

async function getOrdersQuery(parent, args, context, info) {
  const fnName = 'getOrders';
  const result = await useGraphqlHandler(fnName, getOrders(args));
  return result;
}

module.exports = {
  getOrders: getOrdersQuery,
};

