// src/pages/TopicDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTopicById, getResponsesByTopicId, createResponse } from "../services/api";

export default function TopicDetail() {
const { id } = useParams();
const [topic, setTopic] = useState(null);
const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");

useEffect(() => {
    const load = async () => {
    try {
        const t = await getTopicById(id);
        setTopic(t);
        const r = await getResponsesByTopicId(id);
        setComments(Array.isArray(r) ? r : (r.content || []));
    } catch (err) {
        console.error(err);
    }
    };
    load();
}, [id]);

const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
    await createResponse({ mensaje: newComment, topicoId: Number(id), autorId: null });
    const r = await getResponsesByTopicId(id);
    setComments(Array.isArray(r) ? r : (r.content || []));
    setNewComment("");
    } catch (err) {
    console.error(err);
    alert("Error al publicar comentario");
    }
};

if (!topic) return <div className="p-10 text-center">Cargando...</div>;

return (
    <div className="min-h-screen bg-gray-900 text-white">
    <Navbar />
    <div className="container" style={{ paddingTop: 84 }}>
        <Link to="/feed" className="text-gray-400">← Volver</Link>

        <div className="reddit-card" style={{ marginTop: 12 }}>
        <div className="card-header">r/{topic.curso} • u/{topic.autor}</div>
        <h1 className="card-title">{topic.titulo}</h1>
        <div className="card-text">{topic.mensaje}</div>
        </div>

        <div className="reddit-card" style={{ marginTop: 12 }}>
        <form onSubmit={handleComment}>
            <textarea className="auth-input" rows={4} placeholder="Escribe un comentario..." value={newComment} onChange={e => setNewComment(e.target.value)} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn-submit" type="submit">Responder</button>
            </div>
        </form>

        <div style={{ marginTop: 12 }}>
            {comments.map(c => (
            <div key={c.id} className="reddit-card" style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{c.autor}</div>
                <div style={{ color: "#9CA3AF", fontSize: 12 }}>{new Date(c.fecha || c.fechaCreacion || Date.now()).toLocaleString()}</div>
                <div style={{ marginTop: 6 }}>{c.mensaje}</div>
            </div>
            ))}
        </div>
        </div>
    </div>
    </div>
);
}



