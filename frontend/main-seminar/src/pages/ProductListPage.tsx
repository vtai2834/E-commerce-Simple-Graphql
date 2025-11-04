import React from "react";
import { useGetProducts } from "../hooks/useGetProducts";
import { useNavigate } from "react-router-dom";

export default function ProductListPage() {
  const { products, loading, error } = useGetProducts();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <ul>
        {products.map(p => (
          <li key={p.id} style={{marginBottom: 12}}>
            <img src={p.image} alt={p.name} style={{width: 50}} />
            <b>{p.name}</b> - {p.price}₫<br />
            <span>
              {p.status === 'OUT_OF_STOCK'
                ? <span style={{color: 'red'}}>Hết hàng</span>
                : p.status === 'DISCONTINUED'
                  ? <span style={{color: 'gray'}}>Ngừng bán</span>
                  : <span style={{color: 'green'}}>Còn hàng</span>}
              {"  |  "}Kho: {p.stock}
            </span>
            <br />
            <button onClick={() => navigate(`/product/${p.id}`)}>Xem chi tiết</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
