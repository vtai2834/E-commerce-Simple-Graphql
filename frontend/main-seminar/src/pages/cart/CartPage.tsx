import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useCreateOrder, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Giỏ hàng trống</h2>
        <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <button
          onClick={() => navigate('/products')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Giỏ hàng ({getTotalItems()} sản phẩm)</h2>
        <button
          onClick={() => navigate('/products')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tiếp tục mua sắm
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Cart Items */}
        <div>
          {cart.map((item) => (
            <div key={item.id} style={{ 
              display: 'flex', 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              marginBottom: '15px',
              backgroundColor: 'white'
            }}>
              <img
                src={item.image || '/placeholder.jpg'}
                alt={item.name}
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  objectFit: 'cover', 
                  borderRadius: '4px',
                  marginRight: '15px'
                }}
              />
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{item.name}</h4>
                <p style={{ color: '#e74c3c', fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                  {item.price.toLocaleString()}₫
                </p>
                <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
                  Còn lại: {item.stock} sản phẩm
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>Số lượng:</span>
                  <button
                    onClick={() => {
                      if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
                    }}
                    style={{ 
                      padding: '5px 10px',
                      border: '1px solid #ddd',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer'
                    }}
                  >-</button>
                  <span style={{ 
                    padding: '5px 15px',
                    border: '1px solid #ddd',
                    minWidth: '50px',
                    textAlign: 'center'
                  }}>{item.quantity}</span>
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
                    style={{ 
                      padding: '5px 10px',
                      border: '1px solid #ddd',
                      backgroundColor: item.quantity >= item.stock ? '#e9ecef' : '#f8f9fa',
                      cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer'
                    }}
                  >+</button>
                  {/* cảnh báo nếu có */}
                  {stockWarning && (
                    <span style={{ color: 'red', fontWeight:500 }}>{stockWarning}</span>
                  )}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      padding: '5px 15px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginLeft: '20px'
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c' }}>
                  {(item.price * item.quantity).toLocaleString()}₫
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={clearCart}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Xóa toàn bộ giỏ hàng
          </button>
        </div>

        {/* Order Summary */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: 'white'
          }}>
            <h3>Tóm tắt đơn hàng</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Tổng sản phẩm:</span>
                <span>{getTotalItems()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                <span>Tổng tiền:</span>
                <span style={{ color: '#e74c3c' }}>{getTotalAmount().toLocaleString()}₫</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ marginBottom: '20px' }}>
              <h4>Địa chỉ giao hàng (tùy chọn)</h4>
              <input
                type="text"
                placeholder="Địa chỉ"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="text"
                placeholder="Thành phố"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="text"
                placeholder="Mã bưu điện"
                value={shippingAddress.zipCode}
                onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: loading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
