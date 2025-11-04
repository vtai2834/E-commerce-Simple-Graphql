import React, { useState, useEffect } from "react";
import { useLogin, useAuth } from "../../hooks";
import { useDispatch } from "react-redux";
import { login } from "../../store/authenticator-slice";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { SSOCOOKIES, EXPIPRE_TIME_TOKEN } from "../../constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PATIENT" | "PHYSICIAN">("PATIENT");
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
      const loginData = result.data?.loginPatient || result.data?.loginPhysician;
      
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
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label>Vai trò:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "PATIENT" | "PHYSICIAN")}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="PATIENT">Bệnh nhân</option>
            <option value="PHYSICIAN">Bác sĩ</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            Lỗi: {error.message}
          </div>
        )}
      </form>
    </div>
  );
}
