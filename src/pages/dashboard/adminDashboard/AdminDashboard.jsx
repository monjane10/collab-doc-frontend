import React, { useState, useEffect } from "react";
import {
  fetchMostActiveUsers,
  fetchMostEditedDocs,
  fetchTotalPermissions,
  fetchTotalRevisions,
  fetchTotalUsers,
  fetchTotalDocuments,
} from "../../../api/metricsApi.js";
import "./adminDashboard.css";
import DocumentHistoryTable from "../../../components/table/tabela.jsx";
import { fetchDocuments } from "../../../api/documentsApi.js"

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalDocs: 0,
    totalUsers: 0,
    totalRevisions: 0,
    totalPermissions: 0,
  });
  const [mostEditedDocs, setMostEditedDocs] = useState([]);
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      const [totalDocs, totalUsers, totalRevisions, totalPermissions] =
        await Promise.all([
          fetchTotalDocuments(),
          fetchTotalUsers(),
          fetchTotalRevisions(),
          fetchTotalPermissions(),
        ]);

      setMetrics({
        totalDocs,
        totalUsers,
        totalRevisions,
        totalPermissions,
      });

      // Carrega documentos mais editados
      const docs = await fetchMostEditedDocs();
      const mappedDocs = docs.map(d => ({
        title: d.title ?? "Sem título",
        edits: d.editCount ?? 0
      }));
      setMostEditedDocs(mappedDocs);

      const users = await fetchMostActiveUsers();
      const mappedUsers = users.map(u => ({
        username: u.username ?? "Sem nome",
        createdDocs: u.createdDocs ?? 0,
        editedDocs: u.editedDocs ?? 0,
        totalActions: u.totalActions ?? 0
      }));
      setMostActiveUsers(mappedUsers);

      // Carrega todos os documentos
      const allDocuments = await fetchDocuments();
      setDocuments(allDocuments);

    } catch (err) {
      console.error("Erro ao carregar métricas:", err);
    }
  }


  // Colunas que você quer mostrar na tabela
  const columns = [
    { key: "title", title: "Título" },
    { key: "lastEdited", title: "Última edição" },
    { key: "username", title: "Usuário" },
  ];

  const tableData = documents.map(doc => ({
    title: doc.title,
    lastEdited: new Date(doc.updatedAt).toLocaleString(), // opcional: formata a data
    username: doc.owner ?? "Sem dono",
  }));

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      {/* Cards de métricas */}
      <div className="dashboard-metrics">
        <div className="metric-card blue">
          <h2>{metrics.totalDocs ?? 0}</h2>
          <p>Documentos</p>
        </div>
        <div className="metric-card green">
          <h2>{metrics.totalUsers ?? 0}</h2>
          <p>Utilizadores</p>
        </div>
        <div className="metric-card blue-light">
          <h2>{metrics.totalRevisions ?? 0}</h2>
          <p>Revisões</p>
        </div>
        <div className="metric-card green-light">
          <h2>{metrics.totalPermissions ?? 0}</h2>
          <p>Permissões</p>
        </div>
      </div>

      <div className="dashboard-charts-wrapper">
        {/* Tabela de Documentos Mais Editados */}
        <div className="dashboard-table-wrapper">
          <h3>Documentos Mais Editados</h3>
          {mostEditedDocs?.length > 0 ? (
            <table className="documents-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Edições</th>
                </tr>
              </thead>
              <tbody>
                {mostEditedDocs.map((doc, index) => (
                  <tr key={index}>
                    <td>{doc.title}</td>
                    <td>{doc.edits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Nenhum documento encontrado.</div>
          )}
        </div>
        <div className="dashboard-table-wrapper">
          <h3>Utilizadores Mais Activos</h3>
          {mostActiveUsers?.length > 0 ? (
            <table className="documents-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Documentos criados</th>
                  <th> Documentos Actualizados</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {mostActiveUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.createdDocs}</td>
                    <td>{user.editedDocs}</td>
                    <td>{user.totalActions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Nenhum documento encontrado.</div>
          )}
        </div>
      </div>
      {/* Tabela de histórico de documentos */}
      <div className="dashboard-table-wrapper">
        {documents?.length > 0 && (
          <DocumentHistoryTable
            title="Histórico de Documentos"
            columns={columns}
            data={tableData}
            itemsPerPage={5}
          />
        )}
      </div>






    </div>
  );
}
