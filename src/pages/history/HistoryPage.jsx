import React, { useEffect, useState } from "react";
import { fetchDocumentsByUser, fetchHistoryByUser } from "../../api/documentsApi.js";
import "./history.css";
import DocumentHistoryTable from "../../components/table/tabela.jsx";

export default function HistoryPage() {
    const [documents, setDocuments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Carregar documentos do usuário logado
    useEffect(() => {
        async function loadDocuments() {
            try {
                const docs = await fetchDocumentsByUser();
                setDocuments(docs);
            } catch (err) {
                console.error("Erro ao buscar documentos:", err);
            } finally {
                setLoadingDocs(false);
            }
        }
        loadDocuments();
    }, []);

    // Carregar histórico do documento selecionado
    useEffect(() => {
        if (!selectedDoc) return;

        async function loadHistory() {
            setLoadingHistory(true);
            try {
                const revisions = await fetchHistoryByUser(selectedDoc.id);
                setHistory(revisions);
            } catch (err) {
                console.error("Erro ao buscar histórico:", err);
            } finally {
                setLoadingHistory(false);
            }
        }

        loadHistory();
    }, [selectedDoc]);

    if (loadingDocs) return <div>Carregando documentos...</div>;

    return (
        <>
        
       
            <div className="dashboard-content">
      
                <h2>Historico de Revisoes</h2>
                {documents.length === 0 ? (
                    <div>Nenhum documento encontrado</div>
                ) : (
                    <ul className="document-list">
                        {documents.map(doc => (
                            <li key={doc.id}>
                                <button onClick={() => setSelectedDoc(doc)}>
                                    {doc.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                

                {selectedDoc && (
                    <div className="document-history">
                        <h3>Histórico de revisao do documento: {selectedDoc.title}</h3>

                        {loadingHistory ? (
                            <div>Carregando histórico...</div>
                        ) : history.length === 0 ? (
                            <div>Nenhuma atividade encontrada</div>
                        ) : (
                            <DocumentHistoryTable
                                data={history} // passar todos os itens
                                columns={[
                                    { title: "Editor", key: "user", render: row => row.editor?.username || "Desconhecido" },
                                    { title: "Data", key: "createdAt", render: row => new Date(row.createdAt).toLocaleString() },
                                ]}
                                itemsPerPage={5} // opcional, default = 5
                            />
                        )}
                    </div>
                )}

            </div>
            </>
       
    );
}
