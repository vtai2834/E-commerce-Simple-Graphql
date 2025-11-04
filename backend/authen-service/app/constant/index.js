// Error & Success Codes for Authen Service
const RESPONSE_CODE = {
  SUCCESS_QUERY: 1000, // Lấy dữ liệu thành công
  SUCCESS_MUTATION: 1001, // Thao tác thành công (tạo/sửa/xóa)
  INVALID_INPUT: 1002, // Dữ liệu đầu vào không hợp lệ
  NOT_FOUND: 1003, // Không tìm thấy
  UNAUTHORIZED: 1004, // Chưa đăng nhập hoặc token không hợp lệ
  FORBIDDEN: 1005, // Không có quyền truy cập
  TOKEN_EXPIRED: 1006, // AcessToken hết hạn
  SERVER_ERROR: 1099, // Lỗi server
};

module.exports = {
  RESPONSE_CODE,
};
