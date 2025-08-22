import React, { useEffect, useState } from "react";
import { fetchDocumentsByUser, fetchHistoryByUser } from "../../api/documentsApi.js";
import "./history.css";
import DocumentHistoryTable from "../../components/table/tabela.jsx";
import { AiOutlineClose } from "react-icons/ai";


export default function HistoryPage() {
    const [documents, setDocuments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Carregar documentos do usuário
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

    // Carregar histórico ao selecionar documento
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
        <div className="history-page">
            <h3>Documentos Revisados</h3>
            <div className="dashboard-content">
                {documents.length === 0 ? (
                    <div>Nenhum documento encontrado</div>
                ) : (
                    <DocumentHistoryTable
                        data={documents}
                        columns={[
                            {
                                title: "Título",
                                key: "title",
                                render: row => (
                                    <span
                                        onClick={() => setSelectedDoc(row)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {row.title}
                                    </span>
                                )
                            },
                            {
                                title: "Última Edição",
                                key: "updatedAt",
                                render: row => (
                                    <span
                                        onClick={() => setSelectedDoc(row)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {new Date(row.updatedAt).toLocaleString()}
                                    </span>
                                )
                            }
                        ]}
                    />
                )}

                {selectedDoc && (
                    <>
                        <div className="overlay-backdrop" onClick={() => setSelectedDoc(null)} />
                        <div className="document-overlay">
                            <AiOutlineClose
                                className="close-icon"
                                onClick={() => setSelectedDoc(null)}
                            />
                            {loadingHistory ? (
                                <div>Carregando histórico...</div>
                            ) : history.length === 0 ? (
                                <div>Nenhuma atividade encontrada</div>
                            ) : (
                                <DocumentHistoryTable
                                    title={selectedDoc.title}
                                    data={history}
                                    columns={[
                                        {
                                            title: "Editor",
                                            key: "user",
                                            render: row => row.editor?.username || "Desconhecido"
                                        },
                                        {
                                            title: "Data",
                                            key: "createdAt",
                                            render: row => new Date(row.createdAt).toLocaleString()
                                        }
                                    ]}
                                    itemsPerPage={5}
                                />
                            )}
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
