const { createOrder } = require('../../controllers');
const { useGraphqlHandler } = require('../../utils');

async function createOrderMutation(parent, args, context, info) {
  const fnName = 'createOrder';
  const result = await useGraphqlHandler(fnName, createOrder(args));
  return result;
}

module.exports = {
  createOrder: createOrderMutation,
};

