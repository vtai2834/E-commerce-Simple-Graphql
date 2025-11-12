import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProduct } from "../../hooks";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../hooks";
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useGetProduct(id!);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [stockWarning, setStockWarning] = useState<string|null>(null);
  const { user } = useAuth();

  if (loading) return <div>Đang tải thông tin sản phẩm...</div>;
  if (error || !product) return <div>Lỗi: Không thể tải thông tin sản phẩm</div>;

  const canAddToCart = product.status === 'AVAILABLE' && product.stock > 0;
  const maxQuantity = Math.min(product.stock, 10); // Giới hạn tối đa 10 sản phẩm nhưng không vượt stock

  const handleQuantityChange = (v: number) => {
    if (v < 1) v = 1;
    if (v > product.stock) {
      setStockWarning('Vượt quá số lượng còn lại trong kho!');
      return;
    }
    setStockWarning(null);
    setQuantity(v);
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      setStockWarning('Không đủ sản phẩm trong kho để mua!');
      return;
    }
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
    <div className="product-detail-container">
      <div className="product-detail-wrapper">
        <button 
          onClick={() => navigate(-1)}
          className="product-detail-back-button"
        >
          ← Quay lại
        </button>

        <div className="product-detail-grid">
          <img
            src={product.image || '/placeholder.jpg'}
            alt={product.name}
            className="product-detail-image"
          />

          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.name}</h1>

            <span className={`product-detail-status ${product.status === 'AVAILABLE' ? 'available' : product.status === 'OUT_OF_STOCK' ? 'out-of-stock' : 'discontinued'}`}>
              {getStatusText(product.status)}
            </span>

            <div className="product-detail-price">{product.price.toLocaleString()}₫</div>

            <div className="product-detail-meta">
              <span className="product-detail-meta-item"><strong>Danh mục:</strong> {product.category}</span>
              <span className="product-detail-meta-item"><strong>Số lượng trong kho:</strong> {product.stock}</span>
            </div>

            <div className="product-detail-description-box">
              <span className="product-detail-description-label">Mô tả</span>
              <p className="product-detail-description">{product.description}</p>
            </div>

            {user?.role === 'ADMIN' && (
              <div className="product-detail-admin-actions">
                <button className="product-detail-edit-btn">Sửa</button>
                <button className="product-detail-delete-btn">Xóa</button>
              </div>
            )}

            {canAddToCart && (
              <div className="product-detail-quantity-box">
                <span className="product-detail-quantity-label">Số lượng</span>
                <div className="product-detail-quantity-controls">
                  <button onClick={() => handleQuantityChange(quantity - 1)} className="product-detail-quantity-button">-</button>
                  <input
                    type="number"
                    min="1"
                    max={maxQuantity}
                    value={quantity}
                    onChange={e => handleQuantityChange(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="product-detail-quantity-input"
                  />
                  <button onClick={() => handleQuantityChange(quantity + 1)} className="product-detail-quantity-button">+</button>
                  <span className="product-detail-quantity-max">(Tối đa: {maxQuantity})</span>
                </div>
                {stockWarning && <div className="product-detail-stock-warning">{stockWarning}</div>}
              </div>
            )}

            {user?.role === 'CUSTOMER' && (
              <div className="product-detail-buttons">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className="product-detail-add-to-cart"
                >
                  {canAddToCart ? 'Thêm vào giỏ hàng' : 'Không thể mua'}
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="product-detail-view-cart"
                >
                  Xem giỏ hàng
                </button>
              </div>
            )}

            <div className="product-detail-info-section">
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
    </div>
  );
}
