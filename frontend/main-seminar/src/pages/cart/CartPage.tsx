import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useCreateOrder, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import './CartPage.css';

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalAmount, 
    getTotalItems 
  } = useCart();
  
  const [createOrder, { loading }] = useCreateOrder();
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log("user trong trang cart: ", user);
  
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: 'Vietnam',
    zipCode: ''
  });

  const [stockWarning, setStockWarning] = useState<string|null>(null);

  const handleCreateOrder = async () => {
    if (!user.id) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    if (cart.some(item => item.quantity > item.stock)) {
      alert('Có sản phẩm vượt quá số lượng kho, vui lòng kiểm tra lại.');
      return;
    }

    try {
      const orderInput = {
        userId: user.id,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: shippingAddress.street ? shippingAddress : undefined
      };

      const result = await createOrder(orderInput);
      
      if (result.data?.createOrder?.isSuccess) {
        alert("Đặt hàng thành công!");
        clearCart();
        navigate('/orders');
      } else {
        alert(result.data?.createOrder?.message || "Đặt hàng thất bại!");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert("Có lỗi xảy ra khi đặt hàng!");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>Giỏ hàng trống</h2>
          <button onClick={() => navigate('/products')} className="cart-btn-primary">Tiếp tục mua sắm</button>
        </div>
        <div className="cart-main">
          <div className="cart-list" style={{alignItems:'center', justifyContent: 'center', background: 'var(--color-bg-primary)', padding: '40px', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)', minHeight: '300px'}}>
            <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Giỏ hàng ({getTotalItems()} sản phẩm)</h2>
        <button onClick={() => navigate('/products')} className="cart-btn-primary">Tiếp tục mua sắm</button>
      </div>

      <div className="cart-main">
        <div className="cart-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image || '/placeholder.jpg'}
                alt={item.name}
                className="cart-img"
              />
              
              <div className="cart-item-info">
                <h4 className="cart-item-title">{item.name}</h4>
                <p className="cart-item-price">
                  {item.price.toLocaleString()}₫
                </p>
                <p className="cart-item-desc">
                  Còn lại: {item.stock} sản phẩm
                </p>
                
                <div className="cart-qty-controls">
                  <span>Số lượng:</span>
                  <button
                    onClick={() => {
                      if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
                    }}
                    className="cart-qty-bt"
                  >-</button>
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, Math.min(item.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="cart-qty-input"
                  />
                  <button
                    onClick={() => {
                      if (item.quantity < item.stock) {
                        setStockWarning(null);
                        updateQuantity(item.id, item.quantity + 1);
                      } else {
                        setStockWarning('Vượt quá số lượng còn trong kho!');
                      }
                    }}
                    disabled={item.quantity >= item.stock}
                    className="cart-qty-bt"
                  >+</button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="cart-remove-btn"
                  >
                    Xóa
                  </button>
                </div>
                {stockWarning && item.id === (cart.find(i => i.quantity >= i.stock)?.id) && (
                  <span className="cart-warning">{stockWarning}</span>
                )}
              </div>
              
              <div className="cart-item-total-price">
                {(item.price * item.quantity).toLocaleString()}₫
              </div>
            </div>
          ))}
          
          <button
            onClick={clearCart}
            className="cart-clear-btn"
          >
            Xóa toàn bộ giỏ hàng
          </button>
        </div>

        <div className="cart-summary">
          <div className="cart-summary-title">Tóm tắt đơn hàng</div>
          <div className="cart-summary-row">
            <span>Tổng sản phẩm:</span>
            <span>{getTotalItems()}</span>
          </div>
          <div className="cart-summary-total">
            <span>Tổng tiền:</span>
            <span>{getTotalAmount().toLocaleString()}₫</span>
          </div>

          <div className="cart-shipping-box">
            <div className="cart-shipping-title">Địa chỉ giao hàng (tùy chọn)</div>
            <input
              type="text"
              placeholder="Địa chỉ"
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
              className="cart-input"
            />
            <input
              type="text"
              placeholder="Thành phố"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
              className="cart-input"
            />
            <input
              type="text"
              placeholder="Mã bưu điện"
              value={shippingAddress.zipCode}
              onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
              className="cart-input"
            />
          </div>

          <button
            onClick={handleCreateOrder}
            disabled={loading}
            className="cart-btn-checkout"
          >
            {loading ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </div>
      </div>
    </div>
  );
}