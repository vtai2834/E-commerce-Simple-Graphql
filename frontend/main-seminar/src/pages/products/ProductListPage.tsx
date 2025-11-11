import React, { useState } from "react";
import { useGetProducts, useLogout, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

export default function ProductListPage() {
  const [searchName, setSearchName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState<"AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED" | "">("");
  
  const filter = {
    ...(searchName && { name: searchName }),
    ...(filterCategory && { category: filterCategory }),
    ...(filterStatus && { status: filterStatus })
  };
  
  const { products, loading, error, refetch } = useGetProducts(filter);
  const navigate = useNavigate();
  const [logout, { loading: logoutLoading }] = useLogout();
  const { user } = useAuth();

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Danh sách sản phẩm</h2>
        <div>
          <span style={{ marginRight: '10px' }}>Xin chào, {user.firstName} {user.lastName}</span>
          <button onClick={() => navigate('/cart')} style={{ marginRight: '10px' }}>Giỏ hàng</button>
          <button onClick={() => navigate('/orders')} style={{ marginRight: '10px' }}>Đơn hàng</button>
          <button onClick={logout} disabled={logoutLoading}>
            {logoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ padding: '8px', minWidth: '200px' }}
        />
        <input
          type="text"
          placeholder="Lọc theo danh mục..."
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '8px', minWidth: '150px' }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          style={{ padding: '8px' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="AVAILABLE">Còn hàng</option>
          <option value="OUT_OF_STOCK">Hết hàng</option>
          <option value="DISCONTINUED">Ngừng bán</option>
        </select>
        <button onClick={() => refetch()} style={{ padding: '8px 15px' }}>Làm mới</button>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {products.map((product: any) => (
          <div key={product.id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px',
            backgroundColor: 'white'
          }}>
            <img 
              src={product.image || '/placeholder.jpg'} 
              alt={product.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <h3 style={{ margin: '10px 0' }}>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c' }}>
                {product.price.toLocaleString()}₫
              </span>
              <span style={{ fontSize: '14px' }}>Kho: {product.stock}</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'white',
                backgroundColor: 
                  product.status === 'AVAILABLE' ? '#27ae60' :
                  product.status === 'OUT_OF_STOCK' ? '#e74c3c' : '#95a5a6'
              }}>
                {product.status === 'AVAILABLE' ? 'Còn hàng' :
                 product.status === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Ngừng bán'}
              </span>
              <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                {product.category}
              </span>
            </div>
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              Xem chi tiết
            </button>
            {/* CRUD product chỉ cho Admin */}
            {user?.role === 'ADMIN' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{background: '#27ae60', color: 'white', border: 0, borderRadius: 4, padding: '6px 12px'}}>Sửa</button>
                <button style={{background: '#e74c3c', color: 'white', border: 0, borderRadius: 4, padding: '6px 12px'}}>Xóa</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
          Không tìm thấy sản phẩm nào
        </div>
      )}
    </div>
  );
}
