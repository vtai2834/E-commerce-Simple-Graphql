export const PATH_NAME = {
  LOGIN: '/login',
  PATIENTS: '/patients',
};

export const SSOCOOKIES = {
  access: "accessToken",
  refresh: "refreshToken",
};

export const EXPIPRE_TIME_TOKEN = 1 // 1 day

export enum GENDER  {
  male = 'MALE',
  female = 'FEMALE',
}

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 5,
    MAX_LIMIT: 100,
    PAGE_SIZE_OPTIONS: ['3', '5', '10', '20', '50', '100'],
};

// Error & Success Codes for Authen Service
export const RESPONSE_CODE = {
  SUCCESS_QUERY: 1000, // Lấy dữ liệu thành công
  SUCCESS_MUTATION: 1001, // Thao tác thành công (tạo/sửa/xóa)
  INVALID_INPUT: 1002, // Dữ liệu đầu vào không hợp lệ
  NOT_FOUND: 1003, // Không tìm thấy
  UNAUTHORIZED: 1004, // Chưa đăng nhập hoặc token không hợp lệ
  FORBIDDEN: 1005, // Không có quyền truy cập
  TOKEN_EXPIRED: 1006, // AcessToken hết hạn
  SERVER_ERROR: 1099, // Lỗi server
};

export const DEFAULT_DEBOUNCE_DELAY = 300; // milliseconds
