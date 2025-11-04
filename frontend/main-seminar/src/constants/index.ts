export const PATH_NAME = {
  LOGIN: '/login',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product',
  CART: '/cart',
  ORDERS: '/orders',
};

export const SSOCOOKIES = {
  access: "accessToken",
  refresh: "refreshToken",
};

export const EXPIPRE_TIME_TOKEN = 1 // 1 day

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    PAGE_SIZE_OPTIONS: ['5', '10', '20', '50', '100'],
};

// Error & Success Codes for Backend Services
export const RESPONSE_CODE = {
  SUCCESS_QUERY: 200,
  SUCCESS_MUTATION: 201,
  INVALID_INPUT: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOKEN_EXPIRED: 403,
  SERVER_ERROR: 500,
};

export const DEFAULT_DEBOUNCE_DELAY = 300; // milliseconds
