const { Product } = require('../datasources/mongodb');
const { RESPONSE_CODE } = require('../constant');

// Get list products với filter
async function getProducts({ filter, limit }) {
  try {
    const query = {};
    
    // Build query từ filter
    if (filter) {
      if (filter.category) {
        query.category = filter.category;
      }
      if (filter.status) {
        query.status = filter.status;
      }
      if (filter.name) {
        query.name = { $regex: filter.name, $options: 'i' }; // Case-insensitive search
      }
    }

    const products = await Product.find(query).limit(limit || 100);
    
    return {
      code: RESPONSE_CODE.SUCCESS_QUERY,
      isSuccess: true,
      message: 'Get products successfully',
      data: products,
    };
  } catch (error) {
    return {
      code: RESPONSE_CODE.SERVER_ERROR,
      isSuccess: false,
      message: error.message || 'Error getting products',
    };
  }
}

// Get product by ID
async function getProduct({ id }) {
  try {
    const product = await Product.findById(id);
    
    if (!product) {
      return {
        code: RESPONSE_CODE.NOT_FOUND,
        isSuccess: false,
        message: 'Product not found',
      };
    }

    return {
      code: RESPONSE_CODE.SUCCESS_QUERY,
      isSuccess: true,
      message: 'Get product successfully',
      data: product,
    };
  } catch (error) {
    return {
      code: RESPONSE_CODE.SERVER_ERROR,
      isSuccess: false,
      message: error.message || 'Error getting product',
    };
  }
}

// Create new product
async function createProduct({ input }) {
  try {
    const newProduct = new Product(input);
    await newProduct.save();

    return {
      code: RESPONSE_CODE.SUCCESS_MUTATION,
      isSuccess: true,
      message: 'Product created successfully',
      data: newProduct,
    };
  } catch (error) {
    return {
      code: RESPONSE_CODE.SERVER_ERROR,
      isSuccess: false,
      message: error.message || 'Error creating product',
    };
  }
}

// Update product
async function updateProduct({ id, input }) {
  try {
    const updateInput = { ...input };
    let updatedStatus;

    // Nếu có field stock trong input, backend quyết định status mới
    if (typeof input.stock !== 'undefined') {
      if (input.stock === 0) {
        updateInput.status = 'OUT_OF_STOCK';
        updatedStatus = 'OUT_OF_STOCK';
      } else {
        // Nếu status hiện tại là DISCONTINUED thì giữ nguyên, ngược lại chuyển về AVAILABLE
        const prod = await Product.findById(id);
        if (prod && prod.status !== 'DISCONTINUED') {
          updateInput.status = 'AVAILABLE';
          updatedStatus = 'AVAILABLE';
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateInput },
      { new: true, runValidators: true }
    );

    if (!product) {
      return {
        code: RESPONSE_CODE.NOT_FOUND,
        isSuccess: false,
        message: 'Product not found',
      };
    }

    return {
      code: RESPONSE_CODE.SUCCESS_MUTATION,
      isSuccess: true,
      message: 'Product updated successfully'
        + (updatedStatus ? `. Status set to ${updatedStatus}` : ''),
      data: product,
    };
  } catch (error) {
    return {
      code: RESPONSE_CODE.SERVER_ERROR,
      isSuccess: false,
      message: error.message || 'Error updating product',
    };
  }
}

// Remove (soft delete) product
async function removeProduct({ id }) {
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: { status: 'DISCONTINUED' } },
      { new: true }
    );

    if (!product) {
      return {
        code: RESPONSE_CODE.NOT_FOUND,
        isSuccess: false,
        message: 'Product not found',
      };
    }

    return {
      code: RESPONSE_CODE.SUCCESS_MUTATION,
      isSuccess: true,
      message: 'Product removed successfully',
      data: product,
    };
  } catch (error) {
    return {
      code: RESPONSE_CODE.SERVER_ERROR,
      isSuccess: false,
      message: error.message || 'Error removing product',
    };
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct,
};

