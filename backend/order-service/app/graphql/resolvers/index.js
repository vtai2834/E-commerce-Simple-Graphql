const queryResolver = require('./query');
const mutationResolver = require('./mutation');

module.exports = {
  Query: queryResolver,
  Mutation: mutationResolver,
  
  // Field resolver cho OrderItem.product
  // Apollo Federation sẽ tự động resolve Product từ product-service
  OrderItem: {
    product: (parent) => {
      // Return Product reference - Federation sẽ resolve từ product-service
      return { __typename: 'Product', id: parent.productId };
    },
  },
  
  // Field resolver cho Order (nếu cần)
  Order: {
    // Transform _id thành id cho GraphQL
    id: (parent) => parent._id || parent.id,
  },
};

