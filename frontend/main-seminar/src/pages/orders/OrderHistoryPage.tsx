import React from "react";
import { useGetOrders, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders, loading, error, refetch } = useGetOrders(user?.id || "");

  if (loading) return <div>Đang tải lịch sử đơn hàng...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'PROCESSING': return 'Đang xử lý';
      case 'SHIPPED': return 'Đã giao vận';
      case 'DELIVERED': return 'Đã giao hàng';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'PROCESSING': return '#17a2b8';
      case 'SHIPPED': return '#007bff';
      case 'DELIVERED': return '#28a745';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Lịch sử đơn hàng</h2>
        <div>
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Tiếp tục mua sắm
          </button>
          <button
            onClick={() => refetch()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Làm mới
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h3>Bạn chưa có đơn hàng nào</h3>
          <p>Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên!</p>
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div>
          {orders.map((order: any) => (
            <div key={order.id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '20px', 
              marginBottom: '20px',
              backgroundColor: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>Đơn hàng #{order.id}</h4>
                  <p style={{ color: '#666', margin: '0' }}>
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    color: 'white',
                    backgroundColor: getStatusColor(order.status),
                    fontSize: '14px',
                    marginBottom: '5px'
                  }}>
                    {getStatusText(order.status)}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c' }}>
                    {order.totalAmount.toLocaleString()}₫
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '15px' }}>
                <h5>Sản phẩm đã đặt:</h5>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {order.items.map((item: any, index: number) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px'
                    }}>
                      <div>
                        <span>Sản phẩm ID: {item.productId}</span>
                        <span style={{ marginLeft: '20px', color: '#666' }}>x{item.quantity}</span>
                      </div>
                      <div style={{ fontWeight: 'bold' }}>
                        {(item.price * item.quantity).toLocaleString()}₫
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div style={{ marginBottom: '15px' }}>
                  <h5>Địa chỉ giao hàng:</h5>
                  <div style={{ 
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    color: '#666'
                  }}>
                    {[
                      order.shippingAddress.street,
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.country,
                      order.shippingAddress.zipCode
                    ].filter(Boolean).join(', ')}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '15px',
                borderTop: '1px solid #eee'
              }}>
                <div>
                  <span>Tổng số sản phẩm: {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</span>
                </div>
                <div>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    Tổng tiền: <span style={{ color: '#e74c3c' }}>{order.totalAmount.toLocaleString()}₫</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
