import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTopics } from '../services/api';
import TopicCard from '../components/TopicCard';

export default function Feed() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarTopicos = async () => {
    try {
      const data = await getTopics();
      const lista = Array.isArray(data) ? data : (data.content || []);
      setTopics(lista);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { cargarTopicos(); }, []);

  const s = {
    page: { minHeight: '100vh', background: '#0f172a', paddingTop: '100px', paddingBottom: '50px', color: 'white' },
    container: { maxWidth: '800px', margin: '0 auto', padding: '0 20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '2rem', fontWeight: 'bold' },
    btnCreate: {
      background: '#7c3aed', color: 'white', padding: '12px 24px', borderRadius: '50px',
      fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)', transition: 'transform 0.2s'
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          
          {/* Título normal, sin logo al lado */}
          <h1 style={s.title}>Feed Principal</h1>

          <Link to="/crear-topico" style={s.btnCreate}>
            <i className="fas fa-plus"></i> Crear Tópico
          </Link>
        </div>

        {loading ? <p>Cargando...</p> : (
          topics.map(t => <TopicCard key={t.id} topic={t} />)
        )}
      </div>
    </div>
  );
}