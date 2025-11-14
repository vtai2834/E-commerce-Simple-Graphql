import React from "react";
import { useGetOrders, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import './OrderHistoryPage.css';

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

  return (
    <div className="order-page">
      <div className="order-header">
        <h2 className="order-header-title">Lịch sử đơn hàng</h2>
        <div className="order-actions">
          <button onClick={() => navigate('/products')} className="order-btn-primary">Tiếp tục mua sắm</button>
          <button onClick={() => refetch()} className="order-btn-secondary">Làm mới</button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="order-empty">
          <h3>Bạn chưa có đơn hàng nào</h3>
          <p>Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên!</p>
          <button onClick={() => navigate('/products')} className="order-btn-primary">Mua sắm ngay</button>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order: any) => (
            <div key={order.id} className="order-card">
              <div className="order-meta-row">
                <div>
                  <h4 className="order-id-title">Đơn hàng #{order.id}</h4>
                  <p className="order-date">
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="order-status-and-total">
                  <div className={`order-status ${order.status.toLowerCase()}`}>{getStatusText(order.status)}</div>
                  <div className="order-total">{order.totalAmount.toLocaleString()}₫</div>
                </div>
              </div>

              <div className="order-item-list">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="order-item-row">
                    <div className="order-item-name">
                      Sản phẩm ID: {item.productId}
                      <span className="order-item-meta"> x{item.quantity}</span>
                    </div>
                    <div className="order-item-price">
                      {(item.price * item.quantity).toLocaleString()}₫
                    </div>
                  </div>
                ))}
              </div>

              {order.shippingAddress && (
                <div className="order-shipping-box">
                  <strong>Địa chỉ giao hàng:</strong> {[
                    order.shippingAddress.street,
                    order.shippingAddress.city,
                    order.shippingAddress.state,
                    order.shippingAddress.country,
                    order.shippingAddress.zipCode
                  ].filter(Boolean).join(', ')}
                </div>
              )}

              <div className="order-summary-row">
                <span>Tổng sản phẩm: <strong>{order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</strong></span>
                <span>Tổng tiền: <span className="order-total-text">{order.totalAmount.toLocaleString()}₫</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}