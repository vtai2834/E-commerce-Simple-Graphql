import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/authenticator-slice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login({
      variables: { input: { email, password, role: "PATIENT" } }
    });
    const result = res.data?.loginPatient;
    if (result?.isSuccess) {
      Cookies.set('accessToken', result.accessToken, { expires: 1, sameSite: 'strict' });
      Cookies.set('refreshToken', result.refreshToken, { expires: 7, sameSite: 'strict' });
      dispatch(setUser(result.user));
      navigate('/products');
    } else {
      alert(result?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /><br />
      <button type="submit" disabled={loading}>Đăng nhập</button>
      {error && <div style={{color: 'red'}}>Login failed: {error.message}</div>}
    </form>
  );
}
