const { ApolloServer } = require('@apollo/server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { gql } = require('graphql-tag');
const resolvers = require('./resolvers');
const { dataSources, typeDefs } = require('./middleware');

const createContext = async ({ req }) => {
  const { query } = req.body;
  if (query && query.match(/GetServiceDefinition/)) {
    return {};
  }
  return ({
    token: req.headers['authorization'],
  });
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs: gql`${typeDefs}`, resolvers }),
  dataSources,
  formatError: error => {
    console.error('error of order', { error: error.stack || error.message || error });
    return error;
  },
});
  
module.exports = {
  graphqlServer: server,
  context: createContext,
};

