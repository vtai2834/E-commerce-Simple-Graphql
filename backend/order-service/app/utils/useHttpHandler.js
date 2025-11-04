const { GraphQLError } = require('graphql');

class FalseResponse extends Error {
  constructor(message) {
    super(message);
    this.name = 'FalseResponse';
  }
}

function handleGraphqlError(functionName, error) {
  // return failed response template
  if (error instanceof FalseResponse) {
    return { isSuccess: false, message: error.message };
  }

  console.error(`${functionName} ~ error`, { error: error.stack || error });
  throw new GraphQLError(error);
}

function useGraphqlHandler(fnName, fn) {
  return Promise.resolve(fn)
    .catch(error => handleGraphqlError(fnName, error));
}

module.exports = {
  useGraphqlHandler,
  FalseResponse,
};

