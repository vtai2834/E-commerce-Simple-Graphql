const express = require('express');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const bodyParser = require('body-parser');
const { gql } = require('graphql-tag');
require('dotenv').config();

const { graphqlServer, context } = require('./graphql');

const { connectMongoDB } = require('./datasources/mongodb');

// require('./grpc/service');



const app = express();

(async () => {

  connectMongoDB();

  await graphqlServer.start();

  app.use(cors());
  app.use(bodyParser.json());
  app.use('/', expressMiddleware(graphqlServer, { context }));
  const port = process.env.PORT || 9000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 authen service running on port ${port}`);
  });
})();
