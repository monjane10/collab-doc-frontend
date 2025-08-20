

import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password
      });
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      }
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Credenciais inválidas");
      }
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <h1 className="auth-title">ColabDoc</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" className="auth-input" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="auth-btn">Entrar</button>
        </form>
        {error && <div style={{color: "#d63031", marginTop: "1rem"}}>{error}</div>}
        <Link to="/register" className="auth-link">Não tem conta? Cadastre-se</Link>
      </div>
    </div>
  );
}
