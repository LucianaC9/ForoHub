import React, { useEffect, useState } from 'react';
import { getMisNotificaciones, marcarNotificacionLeida } from '../services/api';
import { getCurrentUser } from '../services/auth';

export default function Notifications() {
const [notificaciones, setNotificaciones] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    cargarDatos();
}, []);

const cargarDatos = async () => {
    const user = getCurrentUser();
    if (user && user.id) {
    try {
        const data = await getMisNotificaciones(user.id);
        // Si el backend devuelve array, lo usamos. Si no, array vacío.
        setNotificaciones(Array.isArray(data) ? data : []);
    } catch (error) { console.error(error); }
    }
    setLoading(false);
};

const handleLeida = async (id) => {
    try {
    await marcarNotificacionLeida(id);
      // Actualizamos la UI para que se vea "leída" (más oscura)
    setNotificaciones(prev => prev.map(n => 
        n.id === id ? { ...n, leida: true } : n
    ));
    } catch (e) { console.error(e); }
};

const s = {
    wrapper: { minHeight: '100vh', background: '#0f172a', paddingTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', color: 'white' },
    container: { width: '90%', maxWidth: '600px' },
    title: { borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px', fontSize: '1.5rem' },
    card: { background: '#1e293b', padding: '15px', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '5px solid #7c3aed', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    cardLeida: { background: '#0f172a', padding: '15px', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '5px solid #475569', opacity: 0.6 },
    msg: { fontSize: '1rem' },
    date: { fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' },
    btnCheck: { background: 'none', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

if (loading) return <div style={s.wrapper}>Cargando notificaciones...</div>;

return (
    <div style={s.wrapper}>
    <div style={s.container}>
        <h2 style={s.title}>🔔 Tus Notificaciones</h2>
        {notificaciones.length === 0 ? <p style={{color:'#94a3b8'}}>No tienes notificaciones nuevas.</p> : (
        notificaciones.map(n => (
            <div key={n.id} style={n.leida ? s.cardLeida : s.card}>
            <div>
                <div style={s.msg}>{n.mensaje}</div>
                <div style={s.date}>{new Date(n.fecha).toLocaleString()}</div>
            </div>
            {!n.leida && (
                <button style={s.btnCheck} onClick={() => handleLeida(n.id)} title="Marcar como leída">✓</button>
            )}
            </div>
        ))
        )}
    </div>
    </div>
);
}