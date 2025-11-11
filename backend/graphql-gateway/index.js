const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } = require('@apollo/gateway');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const PUBLIC_OPERATIONS = ['LoginCustomer', 'LoginAdmin', 'RefreshToken', 'IntrospectionQuery', 'ExampleQuery'];
const { ERROR_CODES } = require('./constants/error.const');

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'authenticate', url: 'http://localhost:9000/graphql' },
      { name: 'order', url: 'http://localhost:9001/graphql' },
      { name: 'product', url: 'http://localhost:9002/graphql' },
      


      // { name: 'facility', url: 'http://facility-service:9001/graphql' },
      // { name: 'physician', url: 'http://physician-service:9002/graphql' },
      // { name: 'patient', url: 'http://patient-service:9003/graphql' },
      // { name: 'care-plan', url: 'http://care-plan-service:9004/graphql' },
      // { name: 'authenticate', url: 'http://authen-service:9005/graphql'},
      //{ name: 'appointment', url: 'http://localhost:9006/graphql' },
      // { name: 'report', url: 'http://localhost:9009/graphql' },
    ],
  }),

  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        console.log('Context in gateway:', context);

        if (context.token) {
          request.http.headers.set('authorization', context.token);
        }
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  introspection: true,
  csrfPrevention: false,
  formatError: (formattedError) => {
    console.log('Formatted error:', formattedError);
    try {
      // Try parse plain JSON error
      const parsed = JSON.parse(formattedError.message);
      console.log('Parsed error from subgraph:', parsed);
      return parsed;
    } catch {
      // Unwrap context creation errors like: "Context creation failed: {"code":1006,...}"
      try {
        const prefix = 'Context creation failed: ';
        if (typeof formattedError.message === 'string' && formattedError.message.startsWith(prefix)) {
          const jsonStr = formattedError.message.slice(prefix.length);
          const parsedCtx = JSON.parse(jsonStr);
          console.log('Parsed error from context:', parsedCtx);
          return parsedCtx;
        }
      } catch {
        //do nothing
      }

      return {
        message: 'Subgraph service unavailable or request failed',
        code: ERROR_CODES.SUBGRAPH_ERROR,
        details: formattedError.message,
      };
    }
  },
});

const app = express();

(async () => {
  await server.start();

  // CORS config
  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const operationName = req.body?.operationName || '';

        if (PUBLIC_OPERATIONS.includes(operationName)) {
          return {};
        }

        if (!token) {
          throw new Error(JSON.stringify({
            message: 'Authorization token missing',
            code: ERROR_CODES.UNAUTHORIZED,
          }));
        }

        try {
          const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
          return { token, user: decoded };
        } catch {
          throw new Error(JSON.stringify({
            code: ERROR_CODES.TOKEN_EXPIRED,
            message: 'Token expired or invalid'
          }));
        }
      }
    }
    ));
  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Apollo gateway running at http://localhost:${port}/graphql`);
  });
})();
