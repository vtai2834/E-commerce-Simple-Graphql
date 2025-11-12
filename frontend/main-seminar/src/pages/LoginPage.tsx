import React, { useState } from "react";
import { useLogin } from "../hooks";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login as loginAction } from "../store/authenticator-slice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'CUSTOMER'|'ADMIN'>("CUSTOMER");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { loading, error }] = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(email, password, role);
      const loginData = result.data?.loginAdmin || result.data?.loginCustomer;
      if (loginData?.isSuccess && loginData.user?.id) {
        Cookies.set('accessToken', loginData.accessToken, { expires: 1, sameSite: 'strict' });
        Cookies.set('refreshToken', loginData.refreshToken, { expires: 7, sameSite: 'strict' });
        dispatch(loginAction({ user: loginData.user, authenticated: true }));
        navigate('/products');
      } else {
        alert(loginData?.message || "Login failed");
      }
    } catch (err) {
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /><br />
      <select value={role} onChange={e => setRole(e.target.value as 'CUSTOMER'|'ADMIN')}>
        <option value="CUSTOMER">Customer</option>
        <option value="ADMIN">Admin</option>
      </select><br />
      <button type="submit" disabled={loading}>Đăng nhập</button>
      {error && <div style={{color: 'red'}}>Login failed: {error.message}</div>}
    </form>
  );
}
