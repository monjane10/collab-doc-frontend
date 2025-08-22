import axios from "axios";

const API_BASE = "https://collab-docs-zn2l.onrender.com/metrics";

// Total de documentos
export async function fetchTotalDocuments() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/documents/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Total de documentos:", response.data.totalDocuments);
    return response.data.totalDocuments;
  } catch (err) {
    console.error("Erro ao buscar total de documentos:", err);
    return 0;
  }
}

// Total de usuários
export async function fetchTotalUsers() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/users/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.totalUsers;
  } catch (err) {
    console.error("Erro ao buscar total de usuários:", err);
    return 0;
  }
}

// Total de revisões
export async function fetchTotalRevisions() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/revisions/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.totalRevisions;
  } catch (err) {
    console.error("Erro ao buscar total de revisões:", err);
    return 0;
  }
}

// Total de permissões
export async function fetchTotalPermissions() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/permissions/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.totalPermissions;
  } catch (err) {
    console.error("Erro ao buscar total de permissões:", err);
    return 0;
  }
}

// Documentos mais editados
export async function fetchMostEditedDocs() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/documents/most-edited`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Documentos mais editados:", response.data);
    return response.data;
  } catch (err) {
    console.error("Erro ao buscar documentos mais editados:", err);
    return [];
  }
}

// Usuários mais activos
export async function fetchMostActiveUsers() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/users/most-active`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Usuários mais activos:", response.data);
    return response.data
  } catch (err) {
    console.error("Erro ao buscar usuários mais ativos:", err);
    return [];
  }
}
