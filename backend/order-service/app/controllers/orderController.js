const { Order, Product } = require('../datasources/mongodb');
const { RESPONSE_CODE } = require('../constant');
const mongoose = require('mongoose');
// Kết nối tới Product collection (giả sử 2 service cùng mongo)

// Hàm helper trừ stock cho product
async function reduceProductStock(items = []) {
  // items = [{ productId, quantity }]
  for (const item of items) {
    // Giảm stock về >= 0, không cho âm
    const product = await Product.findById(item.productId);
    if (product) {
      const newStock = Math.max(0, (product.stock || 0) - item.quantity);
      let status = product.status;
      if (newStock === 0) status = 'OUT_OF_STOCK';
      if (newStock > 0 && status !== 'DISCONTINUED') status = 'AVAILABLE';
      await Product.findByIdAndUpdate(item.productId, { $set: { stock: newStock, status } });
    }
  }
}

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

    // 1. Trừ stock trước khi lưu (bảo vệ đơn hàng ảo)
    await reduceProductStock(input.items);

    // 2. Tạo order với tổng tiền đã tính
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

