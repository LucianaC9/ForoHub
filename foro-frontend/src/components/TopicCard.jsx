import React, { useState, useEffect } from 'react';
import { likeTopic, eliminarTopico, crearRespuesta, getRespuestasPorTopico, likeRespuesta, eliminarRespuesta, solicitarAmistad } from '../services/api';
import { getCurrentUser } from '../services/auth';

export default function TopicCard({ topic, refresh }) {
const user = getCurrentUser();
const isAuthor = user && (topic.autor === user.nombre || topic.autor === user.nombreUsuario);

// --- SOLUCIÓN: REACT AHORA LEE LOS NOMBRES EXACTOS DE TU DTO DE JAVA ---
const [likes, setLikes] = useState(topic.cantidadLikes || 0);
const [liked, setLiked] = useState(topic.usuarioDioLike || false);

const [showComments, setShowComments] = useState(false);
const [respuestas, setRespuestas] = useState([]);
const [newResponse, setNewResponse] = useState('');

// --- EL VIGILANTE ---
// Si navegas a otra sección y vuelves, esto obliga a React a leer los datos frescos del servidor
useEffect(() => {
    setLikes(topic.cantidadLikes || 0);
    setLiked(topic.usuarioDioLike || false);
}, [topic]);

useEffect(() => {
    if (showComments) cargarRespuestas();
}, [showComments]);

const cargarRespuestas = async () => {
    try {
        const data = await getRespuestasPorTopico(topic.id);
        setRespuestas(data || []);
    } catch (e) { console.error("Error cargando respuestas", e); }
};

const handleAddFriend = async () => {
    if (!topic.autorId) { alert("Error: ID autor no disponible."); return; }
    try { await solicitarAmistad(user.id, topic.autorId); alert(`Solicitud enviada a ${topic.autor}`); } 
    catch (e) { alert("Ya existe una solicitud o amistad."); }
};

const handleLike = async () => {
    const prevLikes = likes; const prevLiked = liked;
    setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1);
    try { await likeTopic(topic.id); } catch (e) { setLiked(prevLiked); setLikes(prevLikes); }
};

const handleDelete = async () => {
    if (window.confirm("¿Eliminar tópico?")) {
        try { await eliminarTopico(topic.id); if (refresh) refresh(); } catch (e) { alert("Error al eliminar."); }
    }
};

const handleReply = async (e) => {
    e.preventDefault();
    if (!newResponse.trim()) return;
    try {
        await crearRespuesta({ mensaje: newResponse, topicoId: topic.id, autorId: user.id });
        setNewResponse('');
        cargarRespuestas();
    } catch (e) { alert("Error al comentar."); }
};

  // --- LÓGICA DE LIKE PARA RESPUESTAS ---
const handleLikeRespuesta = async (rid) => {
    const target = respuestas.find(r => r.id === rid);
    if(!target) return;

    // Aquí también asumimos que tu DTO de respuestas usa usuarioDioLike
    const wasLiked = target.usuarioDioLike !== undefined ? target.usuarioDioLike : target.userLiked;
    
    setRespuestas(prev => prev.map(r => {
        if (r.id === rid) {
            const currentLikes = r.cantidadLikes !== undefined ? r.cantidadLikes : r.likes;
            return {
                ...r,
                usuarioDioLike: !wasLiked, // Actualizamos con el nombre correcto
                cantidadLikes: wasLiked ? currentLikes - 1 : currentLikes + 1 
            };
        }
        return r;
    }));

    try { await likeRespuesta(rid); } 
      catch(e) { cargarRespuestas(); } 
};

const handleDeleteRespuesta = async (rid) => {
    if(!window.confirm("¿Borrar comentario?")) return;
    try { await eliminarRespuesta(rid); setRespuestas(prev => prev.filter(r => r.id !== rid)); } 
    catch(e) { alert("Error al borrar."); }
};

const s = {
    card: { background: '#1e293b', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)', color: 'white' },
    header: { display:'flex', justifyContent:'space-between', marginBottom:'15px', color:'#94a3b8', fontSize:'0.9rem' },
    title: { fontSize: '1.4rem', fontWeight: 'bold', margin: '0 0 10px 0', color: '#f8fafc' },
    body: { fontSize: '1rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px' },
    actions: { display: 'flex', gap: '15px' },
    btn: { background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: 'none', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer' },
    commentSec: { marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '15px' },
    comment: { background: '#0f172a', padding: '12px', borderRadius: '10px', marginBottom: '10px' },
    cMeta: { display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'#94a3b8', marginBottom:'5px' },
    cActions: { display:'flex', gap:'15px', fontSize:'0.85rem', marginTop:'8px' },
    likeBtn: { cursor:'pointer', display:'flex', alignItems:'center', gap:'5px' },
    input: { width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '10px', borderRadius: '8px', color: 'white', marginBottom: '10px' }
};

return (
    <div style={s.card}>
    <div style={s.header}>
        <div>
            Por <strong>{topic.autor}</strong>
            {user && topic.autor !== user.nombreUsuario && (
                <button onClick={handleAddFriend} style={{background:'none', border:'none', cursor:'pointer', marginLeft:'8px'}}>➕</button>
            )}
        </div>
        <div>
            {new Date(topic.fechaCreacion).toLocaleDateString()}
            {isAuthor && <button onClick={handleDelete} style={{background:'none', border:'none', cursor:'pointer', marginLeft:'10px'}}>🗑️</button>}
        </div>
    </div>
    <h3 style={s.title}>{topic.titulo}</h3>
    <p style={s.body}>{topic.mensaje}</p>
    <div style={s.actions}>
        <button onClick={handleLike} style={{...s.btn, color: liked ? '#a78bfa' : '#e2e8f0'}}>
            {liked ? '❤️' : '🤍'} {likes}
        </button>
        <button onClick={() => setShowComments(!showComments)} style={s.btn}>💬 Comentarios</button>
    </div>
    {showComments && (
        <div style={s.commentSec}>
            {respuestas.map(r => {
                // Leemos los likes de los comentarios usando las posibles variables
                const rLikes = r.cantidadLikes !== undefined ? r.cantidadLikes : (r.likes || 0);
                const rLiked = r.usuarioDioLike !== undefined ? r.usuarioDioLike : (r.userLiked || false);
                
                return (
                <div key={r.id} style={s.comment}>
                    <div style={s.cMeta}>
                        <span style={{color:'#7c3aed', fontWeight:'bold'}}>{r.autor}</span>
                        <span>{new Date(r.fechaCreacion).toLocaleDateString()}</span>
                    </div>
                    <div style={{color:'white'}}>{r.mensaje}</div>
                    <div style={s.cActions}>
                        <span style={{...s.likeBtn, color: rLiked ? '#f43f5e' : '#cbd5e1'}} onClick={() => handleLikeRespuesta(r.id)}>
                            {rLiked ? '❤️' : '🤍'} {rLikes}
                        </span>
                        {user && user.id === r.autorId && (
                            <span style={{cursor:'pointer', color:'#ef4444'}} onClick={() => handleDeleteRespuesta(r.id)}>🗑️ Eliminar</span>
                        )}
                    </div>
                </div>
            )})}
            <form onSubmit={handleReply}>
                <input style={s.input} placeholder="Escribe..." value={newResponse} onChange={e => setNewResponse(e.target.value)} />
                <button type="submit" style={{...s.btn, background:'#7c3aed'}}>Responder</button>
            </form>
        </div>
    )}
    </div>
);
}