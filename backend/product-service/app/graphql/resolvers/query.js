const { getProducts, getProduct } = require('../../controllers');
const { useGraphqlHandler } = require('../../utils');

async function getProductsQuery(parent, args, context, info) {
  const fnName = 'getProducts';
  const result = await useGraphqlHandler(fnName, getProducts(args));
  return result;
}

async function getProductQuery(parent, args, context, info) {
  const fnName = 'getProduct';
  const result = await useGraphqlHandler(fnName, getProduct(args));
  return result;
}

module.exports = {
  getProducts: getProductsQuery,
  getProduct: getProductQuery,
};

