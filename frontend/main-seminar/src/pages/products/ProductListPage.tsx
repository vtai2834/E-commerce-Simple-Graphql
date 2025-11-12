import React, { useState } from "react";
import { useGetProducts, useLogout, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useCreateProduct } from "../../hooks/products/useCreateProduct";
import { useUpdateProduct } from "../../hooks/products/useUpdateProduct";
import { useRemoveProduct } from "../../hooks/products/useRemoveProduct";

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
    const res = await removeProduct(id);
    if (res.data?.removeProduct?.isSuccess) {
      refetch();
    } else {
      alert(res.data?.removeProduct?.message || "Xóa thất bại");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Danh sách sản phẩm</h2>
        <div>
          {/* NÚT TẠO SẢN PHẨM ADMIN */}
          {user.role === 'ADMIN' && (
            <button onClick={() => setShowCreate(true)} style={{ marginRight: 16, background:'#27ae60',color:'white',padding:'8px 16px',borderRadius:4,border:0 }}>+ Tạo sản phẩm</button>
          )}
          <span style={{ marginRight: '10px' }}>Xin chào, {user.firstName} {user.lastName}</span>
          <button onClick={() => navigate('/cart')} style={{ marginRight: '10px' }}>Giỏ hàng</button>
          <button onClick={() => navigate('/orders')} style={{ marginRight: '10px' }}>Đơn hàng</button>
          <button onClick={logout} disabled={logoutLoading}>
            {logoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>
        </div>
      </div>
      {/* FORM CREATE PRODUCT */}
      {showCreate && (
        <form onSubmit={handleCreateProduct} style={{ background:'#fff',padding:16,border:'1px solid #ddd', borderRadius:6, marginBottom:16 }}>
          <h4>Tạo mới sản phẩm</h4>
          <input name="name" placeholder="Tên" required style={{marginRight:8}} />
          <input name="price" type="number" min={0} placeholder="Giá" required style={{marginRight:8,width:80}} />
          <input name="stock" type="number" min={0} placeholder="Kho" required style={{marginRight:8,width:60}} />
          <input name="category" placeholder="Danh mục" style={{marginRight:8,width:100}} />
          <input name="image" placeholder="Link ảnh (tuỳ chọn)" style={{marginRight:8,width:160}} />
          <textarea name="description" placeholder="Mô tả..." style={{marginRight:8,verticalAlign:'middle'}} rows={1}></textarea>
          <button type="submit" style={{background:'#007bff',color:'white',padding:'6px 14px',borderRadius:4,border:0,marginLeft:8}}>Tạo mới</button>
          <button type="button" onClick={()=>setShowCreate(false)} style={{marginLeft:8}}>Huỷ</button>
        </form>
      )}
      {/* FORM EDIT PRODUCT */}
      {editProduct && (
        <form onSubmit={handleEditProduct} style={{ background:'#fff',padding:16,border:'1px solid #bbb', borderRadius:6, marginBottom:16 }}>
          <h4>Cập nhật sản phẩm: {editProduct.name}</h4>
          <input name="name" placeholder="Tên" defaultValue={editProduct.name} required style={{marginRight:8}} />
          <input name="price" type="number" min={0} placeholder="Giá" defaultValue={editProduct.price} required style={{marginRight:8,width:80}} />
          <input name="stock" type="number" min={0} placeholder="Kho" defaultValue={editProduct.stock} required style={{marginRight:8,width:60}} />
          <input name="category" placeholder="Danh mục" defaultValue={editProduct.category} style={{marginRight:8,width:100}} />
          <input name="image" placeholder="Link ảnh (tuỳ chọn)" defaultValue={editProduct.image} style={{marginRight:8,width:160}} />
          <textarea name="description" placeholder="Mô tả..." defaultValue={editProduct.description} style={{marginRight:8,verticalAlign:'middle'}} rows={1}></textarea>
          <button type="submit" style={{background:'#ffa500',color:'white',padding:'6px 14px',borderRadius:4,border:0,marginLeft:8}}>Cập nhật</button>
          <button type="button" onClick={()=>setEditProduct(null)} style={{marginLeft:8}}>Huỷ</button>
        </form>
      )}
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
                <button onClick={() => setEditProduct(product)} style={{background: '#27ae60', color: 'white', border: 0, borderRadius: 4, padding: '6px 12px'}}>Sửa</button>
                <button onClick={() => handleRemoveProduct(product.id)} style={{background: '#e74c3c', color: 'white', border: 0, borderRadius: 4, padding: '6px 12px'}}>Xóa</button>
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
