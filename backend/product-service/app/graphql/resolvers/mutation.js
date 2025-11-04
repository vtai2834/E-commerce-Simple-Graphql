const { createProduct, updateProduct, removeProduct } = require('../../controllers');
const { useGraphqlHandler } = require('../../utils');

async function createProductMutation(parent, args, context, info) {
  const fnName = 'createProduct';
  const result = await useGraphqlHandler(fnName, createProduct(args));
  return result;
}

async function updateProductMutation(parent, args, context, info) {
  const fnName = 'updateProduct';
  const result = await useGraphqlHandler(fnName, updateProduct(args));
  return result;
}

async function removeProductMutation(parent, args, context, info) {
  const fnName = 'removeProduct';
  const result = await useGraphqlHandler(fnName, removeProduct(args));
  return result;
}

module.exports = {
  createProduct: createProductMutation,
  updateProduct: updateProductMutation,
  removeProduct: removeProductMutation,
};

