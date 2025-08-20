import axios from "axios";

export async function fetchDocuments() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:3000/documents", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch {
    return [];
  }
}

export async function fetchDocumentsByUser() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // pega o usuário logado
  if (!user) return [];

  try {
    const response = await axios.get("http://localhost:3000/documents", {
      headers: { Authorization: `Bearer ${token}` },
      params: { ownerId: user.id } // envia userId como query param
    });

    // Supondo que o backend filtre pelo ownerId ou você pode filtrar aqui
    // return response.data.filter(doc => doc.ownerId === user.id);

    return response.data; 
  } catch (err) {
    console.error("Erro ao buscar documentos:", err);
    return [];
  }
}

// Deleta um documento pelo ID
export async function deleteDocumentById(docId) {
  const token = localStorage.getItem("token");
  if (!docId) return false;

  try {
    await axios.delete(`http://localhost:3000/documents/${docId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return true; // sucesso
  } catch (err) {
    console.error("Erro ao apagar documento:", err);
    return false; // falha
  }
}

export async function fetchHistoryByUser(documentId) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `http://localhost:3000/revisions/${documentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Revisões obtidas:", response.data);
        return response.data; // <-- Retorna os dados da API
    } catch (err) {
        console.error("Erro ao buscar revisões:", err);
        return [];
    }
}
