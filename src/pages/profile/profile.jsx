import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

export default function ProfilePage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")); // pega id do logado
        if (!user?.id) throw new Error("Usuário não encontrado no localStorage");

        const res = await axios.get(`https://collab-docs-zn2l.onrender.com/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm(res.data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        setMessage("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://collab-docs-zn2l.onrender.com/users/${form.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Perfil atualizado com sucesso!");
      localStorage.setItem("user", JSON.stringify(form)); // atualiza cache local
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setMessage("Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="profile-container">Carregando perfil...</div>;

  return (
    <div className="profile-container">
      <h2>Meu Perfil</h2>

      {message && <div className="profile-message">{message}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Nome de utilizador:
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Palavra-passe:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Papel:
          <input type="text" value={form.role} disabled />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
