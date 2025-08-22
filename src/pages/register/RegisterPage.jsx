

import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(" https://collab-docs-zn2l.onrender.com/users", {
        username,
        email,
        password
      });
      setSuccess("Conta criada com sucesso!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao cadastrar");
      }
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <h1 className="auth-title">Criar Conta</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Nome de utilizador" className="auth-input" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" className="auth-input" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="auth-btn">Cadastrar</button>
        </form>
        {error && <div style={{color: "#d63031", marginTop: "1rem"}}>{error}</div>}
        {success && <div style={{color: "#36b37e", marginTop: "1rem"}}>{success}</div>}
      </div>
    </div>
  );
}
