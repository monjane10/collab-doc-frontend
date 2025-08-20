import React, { useState, useEffect } from "react";
import {
  fetchMostActiveUsers,
  fetchMostEditedDocs,
  fetchTotalPermissions,
  fetchTotalRevisions,
  fetchTotalUsers,
  fetchTotalDocuments,
} from "./metricsApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./adminDashboard.css";
import DocumentHistoryTable from "../../components/tabela.jsx";
import { fetchDocuments } from "../dashboard/documentsApi.js"

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

      const docs = await fetchMostEditedDocs(); // [{ title, edits }]
      setMostEditedDocs(docs);

      const users = await fetchMostActiveUsers(); // [{ username, actions }]
      setMostActiveUsers(users);
      const allDocuments = await fetchDocuments(); // Pega todos os documentos
      setDocuments(allDocuments); // Armazena os documentos no estado
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
        {/* Gráfico de documentos mais editados */}
        <div className="dashboard-chart">
          <h3>Documentos mais editados</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mostEditedDocs} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="edits" fill="#4a90e2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de utilizadores mais ativos */}
        <div className="dashboard-chart">
          <h3>Utilizadores mais ativos</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mostActiveUsers} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="username" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="actions" fill="#50e3c2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de histórico de documentos */}
      <div className="dashboard-table-wrapper">
        <h3>Documentos Recentes</h3>
        {documents?.length > 0 && (
          <DocumentHistoryTable
            columns={columns}
            data={tableData}
            itemsPerPage={5}
          />
        )}
      </div>



    </div>
  );
}
