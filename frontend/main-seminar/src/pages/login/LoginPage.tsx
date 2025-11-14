import React, { useState, useEffect } from "react";
import { useLogin, useAuth } from "../../hooks";
import { useDispatch } from "react-redux";
import { login } from "../../store/authenticator-slice";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { SSOCOOKIES, EXPIPRE_TIME_TOKEN } from "../../constants";
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "CUSTOMER">("CUSTOMER");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [loginMutation, { loading, error }] = useLogin();

  const from = location.state?.from?.pathname || "/products";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await loginMutation(email, password, role);
      // FE FE mapping
      const loginData = result.data?.loginAdmin || result.data?.loginCustomer;
      
      if (loginData?.isSuccess) {
        // Save tokens to cookies
        Cookies.set(SSOCOOKIES.access, loginData.accessToken, { 
          expires: EXPIPRE_TIME_TOKEN, 
          sameSite: 'strict' 
        });
        Cookies.set(SSOCOOKIES.refresh, loginData.refreshToken, { 
          expires: 7, 
          sameSite: 'strict' 
        });
        
        // Save user to Redux
        dispatch(login({
          user: loginData.user,
          authenticated: true
        }));
        
        // Navigate to intended page or products
        navigate(from, { replace: true });
      } else {
        alert(loginData?.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Có lỗi xảy ra khi đăng nhập");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Đăng nhập</h2>
          <div className="login-form-group">
            <label className="login-label">Email:</label>
            <input type="email" className="login-input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="login-form-group">
            <label className="login-label">Mật khẩu:</label>
            <input type="password" className="login-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="login-form-group">
            <label className="login-label">Vai trò:</label>
            <select className="login-input" value={role} onChange={e => setRole(e.target.value as "ADMIN" | "CUSTOMER") }>
              <option value="CUSTOMER">Khách hàng (Customer)</option>
              <option value="ADMIN">Quản trị viên (Admin)</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          {error && <div className="login-error">Lỗi: {error.message}</div>}
        </form>
      </div>
    </div>
  );
}