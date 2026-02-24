import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth';
import { getMyNotifications, marcarNotificacionLeida, responderAmistad, getMyProfile } from '../services/api';

import logoImg from '../assets/logo.png'; 

export default function Navbar() {
const navigate = useNavigate();
const userInit = getCurrentUser();
const [user, setUser] = useState(userInit);
const [notificaciones, setNotificaciones] = useState([]);
const [showNotif, setShowNotif] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
    if (userInit) cargarDatos();
}, []);

const cargarDatos = async () => {
    try {
        const profile = await getMyProfile();
        if(profile) setUser(profile);

        const notifData = await getMyNotifications(userInit.id);
        if (Array.isArray(notifData)) {
            const sorted = notifData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            setNotificaciones(sorted);
            setUnreadCount(sorted.filter(n => !n.leida).length);
        }
    } catch (e) { console.error("Error navbar", e); }
};

const toggleNotif = () => {
    setShowNotif(!showNotif);
    if (!showNotif && unreadCount > 0) {
        setUnreadCount(0);
        notificaciones.forEach(n => { if(!n.leida) marcarNotificacionLeida(n.id); });
    }
};

const handleResponder = async (notifId, amistadId, aceptar) => {
    try {
        setNotificaciones(prev => prev.map(n => {
            if (n.id === notifId) {
                return { 
                    ...n, 
                    mensaje: aceptar ? "✅ Solicitud Aceptada. ¡Ahora son amigos!" : "❌ Solicitud Eliminada", 
                    relacionadoId: null, 
                    leida: true 
                };
            }
            return n;
        }));
        await responderAmistad(amistadId, aceptar);
    } catch (e) { 
        console.error(e);
        alert("Hubo un problema al procesar la solicitud.");
        cargarDatos(); 
    }
};

const handleLogout = () => { logout(); navigate('/login'); };

const BellIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);

const s = {
    nav: { background: '#13111e', height: '80px', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' },
    
    logoLink: { textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' },
    logoImage: { 
        width: '75px', 
        height: '75px', 
        objectFit: 'cover', 
        objectPosition: 'top',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
    },
    // Eliminé el estilo 'logoText' porque ya no se usa.

    rightSection: { display: 'flex', alignItems: 'center', gap: '15px' },
    circleBtn: { width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', position: 'relative', transition: 'background 0.2s' },
    avatarBtn: { width: '45px', height: '45px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    badge: { position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: 'white', fontSize: '0.7rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid #13111e' },
    
    dropdown: { position: 'absolute', top: '75px', right: '40px', width: '350px', background: '#1e293b', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 2000, overflow: 'hidden' },
    dropdownHeader: { padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold', color: '#f8fafc', background: '#0f172a' },
    notifList: { maxHeight: '400px', overflowY: 'auto' },
    notifItem: { padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem', color: '#cbd5e1', display:'flex', flexDirection:'column', gap:'6px', transition: 'background 0.2s' },
    actionContainer: { display: 'flex', gap: '10px', marginTop: '10px' },
    btnAccept: { flex: 1, background: '#22c55e', border: 'none', borderRadius: '8px', padding: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', transition: 'opacity 0.2s' },
    btnReject: { flex: 1, background: '#ef4444', border: 'none', borderRadius: '8px', padding: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', transition: 'opacity 0.2s' }
};

return (
    <nav style={s.nav}>
    
    <Link to="/feed" style={s.logoLink}>
        <img src={logoImg} alt="Logo ForoHub" style={s.logoImage} />
        {/* AQUÍ BORRÉ LA LÍNEA: <span style={s.logoText}>ForoHub</span> */}
    </Link>

    <div style={s.rightSection}>
        <div style={{position: 'relative'}}>
            <button 
                style={s.circleBtn} 
                onClick={toggleNotif} 
                title="Notificaciones"
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
                <BellIcon />
                {unreadCount > 0 && <div style={s.badge}>{unreadCount}</div>}
            </button>

            {showNotif && (
                <div style={s.dropdown}>
                    <div style={s.dropdownHeader}>Notificaciones</div>
                    <div style={s.notifList}>
                        {notificaciones.length === 0 ? (
                            <div style={{padding:'30px', textAlign:'center', color:'#64748b'}}>No tienes notificaciones nuevas</div>
                        ) : (
                            notificaciones.map(n => (
                                <div key={n.id} style={{...s.notifItem, background: n.leida ? 'transparent' : 'rgba(124, 58, 237, 0.08)'}}>
                                    <div style={{fontWeight: n.leida ? 'normal' : 'bold', color: n.leida ? '#cbd5e1' : 'white'}}>{n.mensaje}</div>
                                    <div style={{fontSize:'0.75rem', color:'#64748b'}}>{new Date(n.fecha).toLocaleString()}</div>
                                    {(n.mensaje.toLowerCase().includes("solicitud") || n.mensaje.toLowerCase().includes("amistad")) && n.relacionadoId && (
                                        <div style={s.actionContainer}>
                                            <button style={s.btnAccept} onClick={() => handleResponder(n.id, n.relacionadoId, true)}>Aceptar</button>
                                            <button style={s.btnReject} onClick={() => handleResponder(n.id, n.relacionadoId, false)}>Eliminar</button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
        <Link to="/profile" style={s.avatarBtn} title="Mi Perfil">
        {user && user.foto ? (<img src={user.foto} style={s.avatarImg} alt="P" />) : (<span>{user && user.nombreUsuario ? user.nombreUsuario.charAt(0).toUpperCase() : 'U'}</span>)}
        </Link>
        <button 
            onClick={handleLogout} 
            style={s.circleBtn} 
            title="Cerrar Sesión"
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
    </div>
    </nav>
);
}