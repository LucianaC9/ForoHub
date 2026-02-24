import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getMyProfile } from '../services/api'; // Importamos getMyProfile

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // PASO 1: Obtener el Token
      const payload = { 
        email: formData.email, 
        password: formData.password 
      };

      const authResponse = await loginUser(payload);

      if (authResponse && authResponse.token) {
        // Guardamos el token
        localStorage.setItem('token', authResponse.token);
        
        // PASO 2 (CRÍTICO): Pedir los datos del usuario usando el token
        // Como el login no nos dio el ID, lo buscamos manualmente
        try {
            const userDetails = await getMyProfile(); // Llama a /api/usuarios/me
            
            if (userDetails && userDetails.id) {
                // Ahora sí tenemos ID, nombre y email
                localStorage.setItem('user', JSON.stringify(userDetails));
                console.log("Usuario identificado:", userDetails);
                navigate('/feed');
            } else {
                setError("Login exitoso, pero no se pudo cargar el perfil.");
            }
        } catch (profileError) {
            console.error("Error obteniendo perfil:", profileError);
            setError("Error al cargar tus datos de usuario.");
        }

      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión o contraseña incorrecta.");
    }
  };

  const s = {
    wrapper: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", zIndex: 50 },
    card: { background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '24px', padding: '3rem', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    title: { color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: 0 },
    input: { width: '100%', padding: '14px 20px', borderRadius: '50px', border: 'none', background: 'rgba(255,255,255,0.9)', fontSize: '1rem', outline: 'none', color: '#333' },
    btn: { width: '100%', padding: '14px', borderRadius: '50px', border: 'none', background: '#4c1d95', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', marginTop: '10px' },
    link: { color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem', marginTop: '10px', display: 'inline-block' },
    error: { background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }
  };

  return (
    <div style={s.wrapper}>
      <form style={s.card} onSubmit={handleSubmit}>
        <h2 style={s.title}>Iniciar Sesión</h2>
        {error && <div style={s.error}>{error}</div>}
        <input style={s.input} type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
        <input style={s.input} type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
        <button type="submit" style={s.btn}>Ingresar</button>
        <Link to="/register" style={s.link}>¿No tienes cuenta? <span style={{fontWeight:'bold', color:'white'}}>Regístrate aquí</span></Link>
      </form>
    </div>
  );
}