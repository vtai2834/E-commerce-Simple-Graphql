# GraphQL Gateway

## Introduction

This service acts as the GraphQL gateway, federating multiple subgraph services into a single unified API endpoint for the fullstack healthcare system.

## Requirements

- Node.js >= 18.x

## Getting Started (Local Development)

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Copy and configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env as needed
   ```
4. **Start the service:**
   ```bash
   npm run start-local
   # or
   npm start
   ```

The API will run at `http://localhost:8080` by default.

## Adding a New Subgraph

To add a new subgraph service to the GraphQL Gateway:

1. **Start your new subgraph service** and ensure it is running and accessible (e.g., at `http://localhost:9002`).
2. **Edit the gateway configuration** in `index.js`:
   - Add a new entry to the `subgraphs` array in the `IntrospectAndCompose` configuration:
   ```js
   const gateway = new ApolloGateway({
     supergraphSdl: new IntrospectAndCompose({
       subgraphs: [
         { name: "patient", url: "http://localhost:9001" },
         { name: "<new-subgraph-name>", url: "http://localhost:<new-port>" },
       ],
     }),
   });
   ```
   - Replace `<new-subgraph-name>` and `<new-port>` with your subgraph's name and port.
3. **Restart the gateway** to apply the changes:
   ```bash
   npm start
   ```
4. **Verify** that the new subgraph is accessible through the unified GraphQL endpoint at `http://localhost:8080`.

> **Tip:** Each subgraph must have a unique name and expose a federated GraphQL schema.
