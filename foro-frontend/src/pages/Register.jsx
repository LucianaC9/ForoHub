import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api'; 

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // --- CORRECCIÓN BASADA EN AuthDTOs.RegisterRequest ---
      // El record espera: (@Email String email, @NotBlank String username, @NotBlank String password)
      const payload = {
        email: formData.email,
        username: formData.nombre, // ¡AQUÍ ESTABA EL ERROR! Mapeamos 'nombre' a 'username'
        password: formData.password
      };
      
      await registerUser(payload);
      alert("¡Registro exitoso! Ahora inicia sesión.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar. Verifica que el email no esté usado.");
    }
  };

  // --- ESTILOS VISUALES (INTACTOS) ---
  const s = {
    wrapper: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", zIndex: 50 },
    card: { background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '24px', padding: '3rem', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '1.2rem' },
    title: { color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: 0 },
    input: { width: '100%', padding: '14px 20px', borderRadius: '50px', border: 'none', background: 'rgba(255,255,255,0.9)', fontSize: '1rem', outline: 'none', color: '#333' },
    btn: { width: '100%', padding: '14px', borderRadius: '50px', border: 'none', background: 'white', color: '#4c1d95', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s', marginTop: '10px' },
    link: { color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem', marginTop: '5px', display: 'inline-block' },
    error: { background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }
  };

  return (
    <div style={s.wrapper}>
      <form style={s.card} onSubmit={handleSubmit}>
        <h2 style={s.title}>Crear Cuenta</h2>
        {error && <div style={s.error}>{error}</div>}
        <input style={s.input} type="text" name="nombre" placeholder="Nombre de usuario" value={formData.nombre} onChange={handleChange} required />
        <input style={s.input} type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
        <input style={s.input} type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
        <button type="submit" style={s.btn}>Registrarse</button>
        <Link to="/login" style={s.link}>¿Ya tienes cuenta? <span style={{fontWeight:'bold', color:'white'}}>Ingresa aquí</span></Link>
      </form>
    </div>
  );
}