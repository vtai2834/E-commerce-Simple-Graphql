const { GraphQLError } = require('graphql');
const { RESPONSE_CODE } = require('../constant');

class FalseResponse extends Error {
  constructor(message, code = RESPONSE_CODE.SERVER_ERROR) {
    super(message);
    this.name = 'FalseResponse';
    this.code = code;
  }
}

function handleGraphqlError(functionName, error) {
  // return failed response template
  if (error instanceof FalseResponse) {
    return { code: error.code, isSuccess: false, message: error.message };
  }

  console.error(`${functionName} ~ error`, { error: error.stack || error });
  return { code: RESPONSE_CODE.SERVER_ERROR, isSuccess: false, message: error.message || 'Internal server error' };
}

function useGraphqlHandler(fnName, fn) {
  return Promise.resolve(fn)
    .catch(error => handleGraphqlError(fnName, error));
}

module.exports = {
  useGraphqlHandler,
  FalseResponse,
};
