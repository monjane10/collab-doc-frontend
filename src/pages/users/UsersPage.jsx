import React, { useEffect, useState } from "react";
import axios from "axios";
import "./users.css";
import DocumentHistoryTable from "../../components/table/tabela.jsx"; // Ajuste o caminho conforme necessário

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://collab-docs-zn2l.onrender.com/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Erro ao buscar utilizadores:", err);
        setError("Não foi possível carregar utilizadores.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  async function deleteUser(id) {
    if (!window.confirm("Tem certeza que deseja remover este utilizador?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://collab-docs-zn2l.onrender.com/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Erro ao apagar utilizador:", err);
      alert("Erro ao apagar utilizador.");
    }
  }



return (
  <div className="users-container">
    <h2>Gestão de Utilizadores</h2>

    {loading && <div>Carregando utilizadores...</div>}
    {error && <div className="error-msg">{error}</div>}

    {!loading && users.length === 0 ? (
      <p>Nenhum utilizador encontrado.</p>
    ) : (
      <DocumentHistoryTable
        data={users}
        itemsPerPage={5} // você pode ajustar
        columns={[
          { title: "ID", key: "id" },
          { title: "Nome", key: "username" },
          { title: "Email", key: "email" },
          { title: "Papel", key: "role" },
          {
            title: "Ações",
            key: "actions",
            render: (user) => (
              <div className="actions-cell">
                <button className="btn-edit">Editar </button>
                <button className="btn-delete" onClick={() => deleteUser(user.id)}>
                  Apagar 
                </button>
              </div>
            ),
          },
        ]}
      />
    )}
  </div>
);

}
