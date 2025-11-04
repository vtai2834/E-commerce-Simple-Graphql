# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose ports
EXPOSE 9005
# gRPC port (if needed in future)
# EXPOSE 50055

# Set environment variables
ENV NODE_ENV=production
ENV PORT=9005

# Start the application
CMD ["node", "app/index.js"]
