import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./create-doc.css";

export default function CreateDocumentPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [collaborators, setCollaborators] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user || !user.id) {
                setError("Usuário não está logado. Não é possível criar documento.");
                setLoading(false);
                return;
            }

            const ownerId = user.id;

            const payload = {
                title: title.trim(),
                content: content.trim(),
                ownerId,
                collaborators: collaborators
                    ? collaborators
                          .split(",")
                          .map((id) => Number(id.trim()))
                          .filter((id) => !isNaN(id))
                    : [],
            };

            console.log("Payload enviado:", payload);

            await axios.post("http://localhost:3000/documents", payload, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            navigate("/dashboard");
        } catch (err) {
            console.error("Erro ao criar documento:", err.response?.data || err.message);
            setError(
                "Erro ao criar documento" +
                (err.response?.data?.error ? `: ${err.response.data.error}` : "")
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="create-doc-container">
            {/* Header com botão de voltar */}
            <div className="create-doc-header">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>⬅ Voltar</button>
                <h2>Criar Documento</h2>
            </div>

            <form className="create-doc-form" onSubmit={handleSubmit}>
                <label>
                    Título:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Conteúdo:
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </label>
                <label>
                    IDs dos colaboradores (separados por vírgula):
                    <input
                        type="text"
                        value={collaborators}
                        onChange={(e) => setCollaborators(e.target.value)}
                        placeholder="Ex: 2,3,4"
                    />
                </label>
                {error && <div className="error-msg">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? "Criando..." : "Criar Documento"}
                </button>
            </form>
        </div>
    );
}
