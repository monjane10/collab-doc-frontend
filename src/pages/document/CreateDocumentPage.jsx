import React, { useState, useEffect } from "react";
import axios from "axios";
import "./create-doc.css";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://collab-docs-zn2l.onrender.com/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data);
    } catch (err) {
      console.error("Erro ao buscar documentos:", err.response?.data || err.message);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        setError("Usuário não está logado.");
        setLoading(false);
        return;
      }

      const payload = {
        title: title.trim(),
        content: content.trim(),
        ownerId: user.id,
        collaborators: collaborators
          ? collaborators.split(",").map((id) => Number(id.trim())).filter((id) => !isNaN(id))
          : [],
      };

      await axios.post("https://collab-docs-zn2l.onrender.com/documents", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setShowCreate(false);
      setTitle("");
      setContent("");
      setCollaborators("");
      fetchDocuments();
    } catch (err) {
      console.error("Erro ao criar documento:", err.response?.data || err.message);
      setError("Erro ao criar documento" + (err.response?.data?.error ? `: ${err.response.data.error}` : ""));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente apagar este documento?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://collab-docs-zn2l.onrender.com/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
    } catch (err) {
      console.error("Erro ao apagar documento:", err.response?.data || err.message);
    }
  }

  return (
    <div className="documents-container">
      <div className="documents-header">
        <h2>Meus Documentos</h2>
        <button className="btn-new" onClick={() => setShowCreate(true)}>+ Novo Documento</button>
      </div>

      <table className="documents-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Conteúdo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.title}</td>
              <td>{doc.content}</td>
              <td>
                <div class="btn-group">
                <button className="btn-edit" onClick={() => alert("Editar funcionalidade ainda não implementada")}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(doc.id)}>Apagar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreate && (
        <div className="dialog-backdrop">
          <div className="dialog-box">
            <h3>Criar Documento</h3>
            <form className="create-doc-form" onSubmit={handleCreate}>
              <label>
                Título:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </label>
              <label>
                Conteúdo:
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
              </label>
              <label>
                IDs dos colaboradores:
                <input
                  type="text"
                  value={collaborators}
                  onChange={(e) => setCollaborators(e.target.value)}
                  placeholder="Ex: 2,3,4"
                />
              </label>
              {error && <div className="error-msg">{error}</div>}
              <div className="dialog-actions">
                <button type="submit" className="btn-confirm" disabled={loading}>
                  {loading ? "Criando..." : "Criar"}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setShowCreate(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
