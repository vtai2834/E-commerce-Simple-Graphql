# Patient API

## Introduction

This service provides APIs for managing patient data, daily health inputs, and related healthcare operations. It is a part of the fullstack healthcare system.

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

The API will run at `http://localhost:9001` by default.

## Source Code Structure

```
patient-api/
├── app/
│   ├── index.js            # Entry point
│   ├── graphql/            # GraphQL schema & resolvers
│   ├── models/             # Mongoose models
│   ├── utils/              # Utility functions
│   └── ...
├── .env.example            # Example environment variables
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```
