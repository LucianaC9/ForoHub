import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTopic } from '../services/api';
import { getCurrentUser } from '../services/auth';

export default function CreateTopic() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Usamos cursoId (numérico)
  const [form, setForm] = useState({ titulo: '', mensaje: '', cursoId: '' });

  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log("Usuario detectado en CreateTopic:", currentUser); // DEBUG

    // Validación flexible: Aceptamos si tiene ID
    if (currentUser && currentUser.id) {
      setUser(currentUser);
    } else {
        // Si falla, mostramos alerta y redirigimos
        alert("Sesión no válida. Por favor inicia sesión nuevamente.");
        navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
        alert("Error: No se identifica el usuario. Intenta reloguearte.");
        return;
    }

    try {
      // TU BACKEND ESPERA EXACTAMENTE ESTO:
      // { titulo: String, mensaje: String, autorId: Long, cursoId: Long }
      const payload = {
        titulo: form.titulo,
        mensaje: form.mensaje,
        autorId: Number(user.id),      // Convertimos a número
        cursoId: Number(form.cursoId)  // Convertimos a número
      };

      if (isNaN(payload.cursoId)) {
          alert("El ID del curso debe ser un número (ej: 1).");
          return;
      }

      await createTopic(payload);
      navigate('/feed'); // Éxito -> Volver al feed
    } catch (error) {
      console.error(error);
      alert("Error al publicar. Verifica que el ID del curso (ej: 1) exista en tu base de datos.");
    }
  };

  // --- ESTILOS OSCUROS ---
  const s = {
    wrapper: { minHeight: '100vh', background: '#0f172a', paddingTop: '100px', paddingBottom: '50px', display: 'flex', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" },
    card: { background: '#1e293b', padding: '40px', borderRadius: '20px', width: '90%', maxWidth: '700px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', border: '1px solid #334155', height: 'fit-content' },
    title: { textAlign: 'center', marginBottom: '30px', fontSize: '2rem', fontWeight: 'bold', color: 'white' },
    label: { display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' },
    input: { width: '100%', padding: '15px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: 'white', marginBottom: '20px', fontSize: '1rem', outline: 'none' },
    textarea: { width: '100%', padding: '15px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: 'white', marginBottom: '20px', fontSize: '1rem', outline: 'none', minHeight: '200px', resize: 'vertical' },
    btnContainer: { display: 'flex', gap: '15px', marginTop: '10px' },
    btnSubmit: { flex: 1, padding: '15px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)' },
    btnCancel: { padding: '15px 30px', background: 'transparent', color: '#94a3b8', border: '1px solid #475569', borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }
  };

  return (
    <div style={s.wrapper}>
      <form style={s.card} onSubmit={handleSubmit}>
        <h2 style={s.title}>Crear Nuevo Tópico</h2>
        
        <div>
          <label style={s.label}>Título</label>
          <input style={s.input} name="titulo" placeholder="¿Sobre qué quieres discutir?" value={form.titulo} onChange={handleChange} required />
        </div>

        <div>
          {/* CAMBIO IMPORTANTE: Input numérico */}
          <label style={s.label}>ID del Curso (Número)</label>
          <input type="number" style={s.input} name="cursoId" placeholder="Ej: 1" value={form.cursoId} onChange={handleChange} required />
        </div>

        <div>
          <label style={s.label}>Mensaje</label>
          <textarea style={s.textarea} name="mensaje" placeholder="Escribe aquí los detalles..." value={form.mensaje} onChange={handleChange} required />
        </div>

        <div style={s.btnContainer}>
          <button type="button" onClick={() => navigate('/feed')} style={s.btnCancel}>Cancelar</button>
          <button type="submit" style={s.btnSubmit}>Publicar</button>
        </div>
      </form>
    </div>
  );
}