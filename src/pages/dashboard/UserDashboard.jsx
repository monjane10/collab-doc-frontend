// UserDashboard.jsx
import React, { useState } from "react";
import { deleteDocumentById, fetchDocumentsByUser } from "./documentsApi";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import DocumentHistoryTable from "../../components/tabela.jsx"; // Ajuste o caminho conforme necessário

export default function UserDashboard() {
    const navigate = useNavigate();
    const [showDocs, setShowDocs] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, docId: null });

    const currentUser = JSON.parse(localStorage.getItem("user"));

    async function handleShowDocuments() {
        setShowDocs(true);
        try {
            const docs = await fetchDocumentsByUser();
            const myDocs = Array.isArray(docs)
                ? docs.filter(doc => doc.owner?.id === currentUser?.id)
                : [];
            setDocuments(myDocs);
        } catch (err) {
            console.error("Erro ao buscar documentos:", err);
            setDocuments([]);
        }
    }

    function openDeleteDialog(id) {
        setDeleteDialog({ open: true, docId: id });
    }

    function closeDeleteDialog() {
        setDeleteDialog({ open: false, docId: null });
    }

    async function confirmDeleteDocument() {
        const success = await deleteDocumentById(deleteDialog.docId);
        if (success) {
            setDocuments(documents.filter(doc => doc.id !== deleteDialog.docId));
        }
        closeDeleteDialog();
    }

    return (
        <>
            <div className="dashboard-title">
                {showDocs ? (
                    <div className="dashboard-header">
                        <button className="back-btn" onClick={() => setShowDocs(false)}>⬅ Voltar</button>
                        <span>Meus Documentos</span>
                    </div>
                ) : (
                    "Painel Principal"
                )}
            </div>

            <div className="dashboard-content">
                {!showDocs ? (
                    <div className="dashboard-cards">
                        {/* Meus Documentos */}
                        <div
                            className="dashboard-card"
                            style={{ borderColor: "var(--primary)", boxShadow: `0 2px 12px var(--primary)22` }}
                            onClick={handleShowDocuments}
                        >
                            <div className="dashboard-card-icon" style={{ color: "var(--primary)" }}>📄</div>
                            <div className="dashboard-card-title">Meus Documentos</div>
                            <div className="dashboard-card-desc">Veja e edite seus documentos</div>
                        </div>

                        {/* Novo Documento */}
                        <div
                            className="dashboard-card"
                            style={{ borderColor: "var(--accent)", boxShadow: `0 2px 12px var(--accent)22` }}
                            onClick={() => navigate("/editor/new")}
                        >
                            <div className="dashboard-card-icon" style={{ color: "var(--accent)" }}>➕</div>
                            <div className="dashboard-card-title">Novo Documento</div>
                            <div className="dashboard-card-desc">Crie um novo documento colaborativo</div>
                        </div>

                        {/* Histórico */}
                        <div
                            className="dashboard-card"
                            style={{ borderColor: "var(--info)", boxShadow: `0 2px 12px var(--info)22` }}
                            onClick={() => navigate("/history/:documentId")}
                        >
                            <div className="dashboard-card-icon" style={{ color: "var(--info)" }}>🕒</div>
                            <div className="dashboard-card-title">Histórico</div>
                            <div className="dashboard-card-desc">Veja alterações e atividades anteriores</div>
                        </div>

                        {/* Permissões */}
                        <div
                            className="dashboard-card"
                            style={{ borderColor: "var(--warning)", boxShadow: `0 2px 12px var(--warning)22` }}
                            onClick={() => navigate("/permissions")}
                        >
                            <div className="dashboard-card-icon" style={{ color: "var(--warning)" }}>🔑</div>
                            <div className="dashboard-card-title">Permissões</div>
                            <div className="dashboard-card-desc">Gerencie quem pode acessar seus documentos</div>
                        </div>
                    </div>

                ) : (
                    documents.length === 0 ? (
                        <div>Nenhum documento encontrado</div>
                    ) : (
                        <DocumentHistoryTable
                            data={documents}
                            itemsPerPage={5}
                            columns={[
                                { title: "Título", key: "title" },
                                { title: "Conteúdo", key: "content" },
                                { title: "Proprietário", key: "owner", render: (doc) => doc.owner?.username || "Desconhecido" },
                                {
                                    title: "Data Criação",
                                    key: "createdAt",
                                    render: (doc) => {
                                        const date = new Date(doc.createdAt);
                                        const day = date.getDate().toString().padStart(2, "0");
                                        const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                        const year = date.getFullYear();
                                        const hours = date.getHours().toString().padStart(2, "0");
                                        const minutes = date.getMinutes().toString().padStart(2, "0");
                                        return `${day}/${month}/${year} ${hours}:${minutes}`;
                                    },
                                },
                                {
                                    title: "Data Actualização",
                                    key: "updatedAt",
                                    render: (doc) => {
                                        const date = new Date(doc.updatedAt);
                                        const day = date.getDate().toString().padStart(2, "0");
                                        const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                        const year = date.getFullYear();
                                        const hours = date.getHours().toString().padStart(2, "0");
                                        const minutes = date.getMinutes().toString().padStart(2, "0");
                                        return `${day}/${month}/${year} ${hours}:${minutes}`;
                                    },
                                },
                                {
                                    title: "Ações",
                                    key: "actions",
                                    render: (doc) => (
                                        <>
                                            <button className="btn-edit" onClick={() => navigate(`/editor/${doc.id}`)}>Editar</button>
                                            <button className="btn-delete" onClick={() => openDeleteDialog(doc.id)}>Apagar</button>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    )
                )}
            </div>

            {deleteDialog.open && (
                <div className="dialog-backdrop">
                    <div className="dialog-box">
                        <h3>Confirmar exclusão</h3>
                        <p>Tem certeza que deseja apagar este documento?</p>
                        <div className="dialog-actions">
                            <button className="btn-confirm" onClick={confirmDeleteDocument}>Sim</button>
                            <button className="btn-cancel" onClick={closeDeleteDialog}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
