import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./editor.css";

const socket = io("http://localhost:3000");

export default function EditorPage() {
    const { id } = useParams(); // id do documento
    const userId = localStorage.getItem("userId"); // id do usuário logado
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(null);

    useEffect(() => {
        socket.emit("joinDocument", { documentId: id, userId });

        socket.on("documentLoaded", (doc) => {
            setTitle(doc.title || "");
            setContent(doc.content || "");
            setLoading(false);
        });

        socket.on("documentUpdated", ({ content: newContent }) => {
            setContent(newContent);
        });

        return () => {
            socket.emit("leaveDocument", { documentId: id, userId });
            socket.off("documentLoaded");
            socket.off("documentUpdated");
        };
    }, [id, userId]);

    function handleContentChange(e) {
        const newContent = e.target.value;
        setContent(newContent);
        socket.emit("editDocument", { documentId: id, content: newContent, userId });
    }

    return (
        <div className="editor-page">
            {/* Header com botão voltar */}
            <div className="editor-header">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    ⬅ Voltar
                </button>
                <h2>{title || "Editor de Documento"}</h2>
            </div>

            {loading ? (
                <div className="loading">Carregando...</div>
            ) : (
                <textarea
                    ref={contentRef}
                    value={content}
                    onChange={handleContentChange}
                    className="editor-textarea"
                    placeholder="Digite o conteúdo..."
                />
            )}
        </div>
    );
}
