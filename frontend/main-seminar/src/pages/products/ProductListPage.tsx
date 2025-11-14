import React, { useState } from "react";
import { useGetProducts, useLogout, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useCreateProduct } from "../../hooks/products/useCreateProduct";
import { useUpdateProduct } from "../../hooks/products/useUpdateProduct";
import { useRemoveProduct } from "../../hooks/products/useRemoveProduct";
import './ProductListPage.css';

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

  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null); // sản phẩm đang edit
  const [deletingId, setDeletingId] = useState<string | null>(null); // State mới để theo dõi ID đang xoá

  const [createProduct, createResult] = useCreateProduct();
  const [updateProduct, updateResult] = useUpdateProduct();
  const [removeProduct, removeResult] = useRemoveProduct();

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  // HANDLERS
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form)) as any;
    data.price = +data.price;
    data.stock = +data.stock;
    const res = await createProduct(data);
    if (res.data?.createProduct?.isSuccess) {
      setShowCreate(false);
      refetch();
    } else {
      alert(res.data?.createProduct?.message || "Tạo sản phẩm thất bại");
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form)) as any;
    data.price = +data.price; data.stock = +data.stock;
    const res = await updateProduct(editProduct.id, data);
    if (res.data?.updateProduct?.isSuccess) {
      setEditProduct(null);
      refetch();
    } else {
      alert(res.data?.updateProduct?.message || "Cập nhật thất bại");
    }
  };

  const handleRemoveProduct = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    
    setDeletingId(id); // Bắt đầu xoá, set ID
    try {
      const res = await removeProduct(id);
      if (res.data?.removeProduct?.isSuccess) {
        refetch();
      } else {
        alert(res.data?.removeProduct?.message || "Xóa thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
      alert("Có lỗi xảy ra khi xoá sản phẩm.");
    } finally {
      setDeletingId(null); // Xoá xong (thành công hay thất bại) thì clear ID
    }
  };

  return (
    <div className="product-list-page">
      <div className="product-list-header">
        <h2 className="product-list-title">Danh sách sản phẩm</h2>
        <div className="product-list-controls">
          <span className="product-list-greeting">Xin chào, {user.firstName} {user.lastName}</span>
          {user.role === 'ADMIN' && (
            <button onClick={() => setShowCreate(true)} className="product-list-btn-primary">+ Tạo sản phẩm</button>
          )}
          <button onClick={() => navigate('/cart')} className="product-list-button">Giỏ hàng</button>
          <button onClick={() => navigate('/orders')} className="product-list-button">Đơn hàng</button>
          <button onClick={logout} disabled={logoutLoading} className="product-list-btn-secondary">
            {logoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>
        </div>
      </div>
      {/* FORM CREATE PRODUCT */}
      {showCreate && (
        <form onSubmit={handleCreateProduct} className="product-list-form">
          <h4>Tạo mới sản phẩm</h4>
          <div className="product-list-form-fields">
            <input name="name" placeholder="Tên" required />
            <input name="price" type="number" min={0} placeholder="Giá" required />
            <input name="stock" type="number" min={0} placeholder="Kho" required />
            <input name="category" placeholder="Danh mục" />
            <input name="image" placeholder="Link ảnh (tuỳ chọn)" />
            <textarea name="description" placeholder="Mô tả..." rows={1}></textarea>
          </div>
          <div className="product-list-form-buttons">
            <button type="submit" className="product-list-btn-primary">Tạo mới</button>
            <button type="button" onClick={()=>setShowCreate(false)} className="product-list-btn-secondary">Huỷ</button>
          </div>
        </form>
      )}
      {/* FORM EDIT PRODUCT */}
      {editProduct && (
        <form onSubmit={handleEditProduct} className="product-list-form">
          <h4>Cập nhật sản phẩm: {editProduct.name}</h4>
          <div className="product-list-form-fields">
            <input name="name" placeholder="Tên" defaultValue={editProduct.name} required />
            <input name="price" type="number" min={0} placeholder="Giá" defaultValue={editProduct.price} required />
            <input name="stock" type="number" min={0} placeholder="Kho" defaultValue={editProduct.stock} required />
            <input name="category" placeholder="Danh mục" defaultValue={editProduct.category} />
            <input name="image" placeholder="Link ảnh (tuỳ chọn)" defaultValue={editProduct.image} />
            <textarea name="description" placeholder="Mô tả..." defaultValue={editProduct.description} rows={1}></textarea>
          </div>
          <div className="product-list-form-buttons">
            <button type="submit" className="product-list-btn-primary">Cập nhật</button>
            <button type="button" onClick={()=>setEditProduct(null)} className="product-list-btn-secondary">Huỷ</button>
          </div>
        </form>
      )}
      {/* Filters */}
      <div className="product-list-filters">
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lọc theo danh mục..."
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="AVAILABLE">Còn hàng</option>
          <option value="OUT_OF_STOCK">Hết hàng</option>
          <option value="DISCONTINUED">Ngừng bán</option>
        </select>
        <button onClick={() => refetch()} className="product-list-btn-secondary">Làm mới</button>
      </div>

      {/* Products Grid */}
      <div className="product-list-grid">
        {products.map((product: any) => (
          <div key={product.id} className="product-list-card">
            <img 
              src={product.image || '/placeholder.jpg'} 
              alt={product.name}
              className="product-list-image"
            />
            <div className="product-list-content">
              <h3 className="product-list-product-title">{product.name}</h3>
              <p className="product-list-description">{product.description}</p>
              <div className="product-list-info-row">
                <span className="product-list-price">{product.price.toLocaleString()}₫</span>
                <span className="product-list-stock">Kho: {product.stock}</span>
              </div>
              <span className={`product-list-status-badge ${product.status === 'AVAILABLE' ? 'available' : product.status === 'OUT_OF_STOCK' ? 'out-of-stock' : 'discontinued'}`}>
                {product.status === 'AVAILABLE' ? 'Còn hàng' :
                 product.status === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Ngừng bán'}
              </span>
              <span className="product-list-category">{product.category}</span>
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="product-list-detail-button"
              >
                Xem chi tiết
              </button>
              {user?.role === 'ADMIN' && (
                <div className="product-list-actions">
                  <button onClick={() => setEditProduct(product)} className="product-list-edit-button">Sửa</button>
                  <button 
                    onClick={() => handleRemoveProduct(product.id)} 
                    className="product-list-delete-button"
                    disabled={deletingId === product.id} 
                  >
                    {deletingId === product.id ? 'Đang xoá...' : 'Xóa'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="product-list-empty-message">
          Không tìm thấy sản phẩm nào
        </div>
      )}
    </div>
  );
}