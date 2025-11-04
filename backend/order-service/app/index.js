const express = require('express');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const bodyParser = require('body-parser');
const { gql } = require('graphql-tag');
require('dotenv').config();

const { graphqlServer, context } = require('./graphql');

const { connectMongoDB } = require('./datasources/mongodb');

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

const app = express();

(async () => {

  connectMongoDB();

  await graphqlServer.start();

  app.use('/', cors(), bodyParser.json(), expressMiddleware(graphqlServer, { context }));
  const port = process.env.PORT || 9001;
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 order service running on port ${port}`);
  });
})();

