import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./layout.css";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Layout() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    // ignore
  }

  const initials = getInitials(user?.username);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="layout-container">
      {/* Botão toggle só no mobile */}
      <button
        className="sidebar-toggle"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`layout-sidebar ${openSidebar ? "open" : ""}`}>
        <span className="layout-title">Doc_Collab</span>
        <nav className="layout-nav">
          <Link to="/dashboard" className="layout-link" onClick={() => setOpenSidebar(false)}>Dashboard</Link>
          <Link to="/editor/new" className="layout-link" onClick={() => setOpenSidebar(false)}>Novo</Link>
          <Link to="/history/1" className="layout-link" onClick={() => setOpenSidebar(false)}>Histórico</Link>
          {user?.role === "admin" && (
            <Link to="/users" className="layout-link" onClick={() => setOpenSidebar(false)}>Utilizadores</Link>
          )}
        </nav>
      </aside>

      {/* Área principal */}
      <div className="layout-content">
        {/* Topbar */}
        <header className="layout-topbar">
          {/* Nome do sistema */}
          <h1 className="system-title">Sistema de Edição colaborativa de documentos</h1>

          {/* Barra de pesquisa */}
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="search-input"
            />
          </div>

          {/* Avatar */}
          <div className="avatar-wrapper">
            <span
              className="layout-avatar"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {initials}
            </span>
            {openMenu && (
              <div className="avatar-menu">
                <div className="avatar-info">
                  <strong>{user?.username}</strong>
                  <small>{user?.email}</small>
                </div>
                <button onClick={() => navigate("/profile")}>Editar Perfil</button>
                <button onClick={handleLogout}>Sair</button>
              </div>
            )}
          </div>
        </header>

        {/* Conteúdo */}
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
