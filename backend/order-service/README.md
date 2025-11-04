# Order Service

Order management service for e-commerce platform using GraphQL and Apollo Federation.

## Features

- Get list of orders by userId
- Create new order
- Apollo Federation integration with Product service

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

- `PORT`: Server port (default: 9003)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (dev/prod)

## GraphQL Schema

### Queries

- `getOrders(userId: String!, limit: Int): OrderListResponse!`

### Mutations

- `createOrder(input: CreateOrderInput!): OrderResponse!`

## Apollo Federation

This service is designed as an Apollo Federation subgraph. It references the Product type from product-service.

### Federation Features

- **Product Reference**: Order service references Product entities from product-service
- **Type Resolution**: OrderItem.product field automatically resolves Product details via federation
- **@key Directive**: Used to identify entities across services

### Example Query (via Gateway)

```graphql
query GetUserOrders {
  getOrders(userId: "user123", limit: 10) {
    code
    isSuccess
    message
    data {
      id
      userId
      items {
        productId
        quantity
        price
        product {
          # This data comes from product-service via federation
          id
          name
          description
          price
        }
      }
      totalAmount
      status
      createdAt
    }
  }
}
```

## Order Model

```javascript
{
  userId: String,
  items: [{
    productId: ID,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

