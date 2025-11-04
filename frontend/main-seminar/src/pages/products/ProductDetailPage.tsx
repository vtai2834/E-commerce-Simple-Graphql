import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProduct } from "../../hooks";
import { useCart } from "../../contexts/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useGetProduct(id!);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading) return <div>Đang tải thông tin sản phẩm...</div>;
  if (error || !product) return <div>Lỗi: Không thể tải thông tin sản phẩm</div>;

  const canAddToCart = product.status === 'AVAILABLE' && product.stock > 0;
  const maxQuantity = Math.min(product.stock, 10); // Giới hạn tối đa 10 sản phẩm mỗi lần

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock
    }, quantity);
    
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Còn hàng';
      case 'OUT_OF_STOCK': return 'Hết hàng';
      case 'DISCONTINUED': return 'Ngừng bán';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return '#27ae60';
      case 'OUT_OF_STOCK': return '#e74c3c'; 
      case 'DISCONTINUED': return '#95a5a6';
      default: return '#666';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ 
          padding: '10px 20px', 
          marginBottom: '20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Quay lại
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        <div>
          <img
            src={product.image || '/placeholder.jpg'}
            alt={product.name}
            style={{ 
              width: '100%', 
              maxHeight: '500px', 
              objectFit: 'cover', 
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div>
          <h1 style={{ marginBottom: '10px' }}>{product.name}</h1>
          
          <div style={{ 
            padding: '4px 12px',
            borderRadius: '4px',
            display: 'inline-block',
            marginBottom: '15px',
            fontSize: '14px',
            color: 'white',
            backgroundColor: getStatusColor(product.status)
          }}>
            {getStatusText(product.status)}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <span style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#e74c3c' 
            }}>
              {product.price.toLocaleString()}₫
            </span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Danh mục:</strong> {product.category}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Số lượng trong kho:</strong> {product.stock}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <strong>Mô tả:</strong>
            <p style={{ marginTop: '10px', lineHeight: '1.6', color: '#666' }}>
              {product.description}
            </p>
          </div>

          {canAddToCart && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <strong>Số lượng:</strong>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ 
                    padding: '5px 10px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f8f9fa',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                  style={{ 
                    width: '80px', 
                    padding: '8px', 
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  style={{ 
                    padding: '5px 10px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f8f9fa',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  (Tối đa: {maxQuantity})
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              style={{
                padding: '12px 24px',
                backgroundColor: canAddToCart ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: canAddToCart ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                flex: 1
              }}
            >
              {canAddToCart ? 'Thêm vào giỏ hàng' : 'Không thể mua'}
            </button>
            
            <button
              onClick={() => navigate('/cart')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Xem giỏ hàng
            </button>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Thông tin sản phẩm</h4>
            <p><strong>Mã sản phẩm:</strong> {product.id}</p>
            <p><strong>Ngày tạo:</strong> {new Date(product.createdAt).toLocaleDateString('vi-VN')}</p>
            {product.updatedAt && (
              <p><strong>Cập nhật lần cuối:</strong> {new Date(product.updatedAt).toLocaleDateString('vi-VN')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
