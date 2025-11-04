const { Order } = require('../datasources/mongodb');
const { RESPONSE_CODE } = require('../constant');

// Get orders by userId
async function getOrders({ userId, limit }) {
  try {
    if (!userId) {
      return {
        code: RESPONSE_CODE.INVALID_INPUT,
        isSuccess: false,
        message: 'userId is required',
      };
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit || 100);
    
    return {
      code: RESPONSE_CODE.SUCCESS_QUERY,
      isSuccess: true,
      message: 'Get orders successfully',
      data: orders,
    };
  } catch (error) {
    return {
      code: RESPONSE_CODE.SERVER_ERROR,
      isSuccess: false,
      message: error.message || 'Error getting orders',
    };
  }
}

// Create new order
async function createOrder({ input }) {
  try {
    // Validate input
    if (!input.userId) {
      return {
        code: RESPONSE_CODE.INVALID_INPUT,
        isSuccess: false,
        message: 'userId is required',
      };
    }

    if (!input.items || input.items.length === 0) {
      return {
        code: RESPONSE_CODE.INVALID_INPUT,
        isSuccess: false,
        message: 'Order must have at least one item',
      };
    }

    // Calculate total amount from items
    const totalAmount = input.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Create order with calculated total
    const newOrder = new Order({
      ...input,
      totalAmount,
      status: 'PENDING',
    });

    await newOrder.save();

    return {
      code: RESPONSE_CODE.SUCCESS_MUTATION,
      isSuccess: true,
      message: 'Order created successfully',
      data: newOrder,
    };
  } catch (error) {
    return {
      code: RESPONSE_CODE.SERVER_ERROR,
      isSuccess: false,
      message: error.message || 'Error creating order',
    };
  }
}

module.exports = {
  getOrders,
  createOrder,
};

