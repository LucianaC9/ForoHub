// src/pages/NewTopic.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getCourses, createTopic } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function NewTopic() {
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(false);
  const navigate = useNavigate();

  const fhUserRaw = localStorage.getItem("fh_user");
  let fhUser = null;
  try { fhUser = fhUserRaw ? JSON.parse(fhUserRaw) : null; } catch { fhUser = null; }

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await getCourses();
        const arr = Array.isArray(res) ? res : (res.content || res || []);
        setCursos(arr);
        if (arr.length > 0) setCursoId(arr[0].id);
      } catch (err) {
        console.warn("No se pudieron cargar los cursos", err);
        setCoursesError(true);
        // fallback: opciones estáticas para que no quede vacío
        setCursos([{ id: null, nombre: "General" }, { id: -1, nombre: "Spring Boot 3" }, { id: -2, nombre: "React G6" }]);
      }
    };
    loadCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        titulo,
        mensaje,
        cursoId: cursoId ? Number(cursoId) : null,
        autorId: fhUser?.id || null
      };
      await createTopic(payload);
      alert("Publicado correctamente");
      navigate("/feed");
    } catch (err) {
      console.error(err);
      alert("Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container" style={{ paddingTop: 100 }}>
        <div className="card" style={{ maxWidth: 820, margin: "0 auto" }}>
          <h2 style={{ margin: 0 }}>Crear publicación</h2>

          {coursesError && <div className="text-red-500" style={{ marginTop: 8 }}>No se pudieron cargar los cursos (usando opciones por defecto)</div>}

          <form onSubmit={handleSubmit} style={{ marginTop: 14, display: "grid", gap: 12 }}>
            <label className="label">Curso</label>
            <select className="auth-input" value={cursoId} onChange={e => setCursoId(e.target.value)}>
              {cursos.map(c => <option key={String(c.id)} value={c.id}>{c.nombre}</option>)}
            </select>

            <label className="label">Título</label>
            <input className="auth-input" value={titulo} onChange={e => setTitulo(e.target.value)} required />

            <label className="label">Mensaje</label>
            <textarea className="auth-input" rows={6} value={mensaje} onChange={e => setMensaje(e.target.value)} required />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" className="btn-cancel" onClick={() => navigate("/feed")}>Cancelar</button>
              <button type="submit" className="btn-submit" disabled={loading}>{loading ? "Publicando..." : "Publicar"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
