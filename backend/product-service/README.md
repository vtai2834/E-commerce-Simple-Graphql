# Product Service

Product management service for e-commerce platform using GraphQL and Apollo Federation.

## Features

- Get list of products with filtering
- Get product details by ID
- Create new product
- Update existing product
- Remove/discontinue product

## Tech Stack

- Node.js + Express
- Apollo Server (GraphQL)
- Apollo Federation (Subgraph)
- MongoDB + Mongoose
- Docker

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

## Environment Variables

- `PORT`: Server port (default: 9002)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (dev/prod)

## GraphQL Schema

### Queries

- `getProducts(filter: ProductFilterInput, limit: Int): ProductListResponse!`
- `getProduct(id: ID!): ProductResponse!`

### Mutations

- `createProduct(input: CreateProductInput!): ProductResponse!`
- `updateProduct(id: ID!, input: UpdateProductInput!): ProductResponse!`
- `removeProduct(id: ID!): ProductResponse!`

## Apollo Federation

This service is designed as an Apollo Federation subgraph. Product type is shareable across the federation.

