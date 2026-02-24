import React from 'react';
import { Link } from 'react-router-dom';
// Asegúrate de que este import coincida con el nombre real de tu archivo en assets
import logoImg from '../assets/logo.png'; 

export default function Home() {
  
  const s = {
    wrapper: {
      position: 'relative', // Necesario para que el logo absoluto se ubique respecto a la pantalla
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #8b5cf6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      overflow: 'hidden'
    },
    // --- NUEVO ESTILO: LOGO EN LA ESQUINA ---
    logoCorner: {
      position: 'absolute',
      top: '25px',       // Separación desde arriba
      left: '25px',      // Separación desde la izquierda
      width: '150px',     // Tamaño "chiquito"
      height: 'auto',
      zIndex: 10,        // Para que quede por encima de todo
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' // Sombra suave para que resalte
    },
    container: {
      maxWidth: '650px',
      width: '90%',
      textAlign: 'center',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: '800',
      margin: 0,
      lineHeight: 1.1,
      textShadow: '0 2px 15px rgba(0,0,0,0.3)'
    },
    desc: {
      fontSize: '1.15rem',
      opacity: 0.9,
      lineHeight: 1.6,
      margin: '1rem 0 2.5rem 0',
      maxWidth: '550px'
    },
    btnContainer: {
      display: 'flex',
      gap: '1.2rem',
      justifyContent: 'center',
      width: '100%',
      marginTop: '20px'
    },
    btnWhite: {
      background: 'white',
      color: '#5b21b6',
      padding: '15px 35px',
      borderRadius: '50px',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '1rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s'
    },
    btnGlass: {
      background: 'rgba(255, 255, 255, 0.15)', 
      color: 'white',
      padding: '15px 35px',
      borderRadius: '50px',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '1rem',
      border: '1px solid rgba(255,255,255,0.4)',
      cursor: 'pointer',
      transition: 'background 0.2s'
    }
  };

  return (
    <div style={s.wrapper}>
      
      {/* 1. EL LOGO SUELTO EN LA ESQUINA (Fuera del container) */}
      <img src={logoImg} alt="Logo ForoHub" style={s.logoCorner} />

      {/* 2. EL CONTENIDO CENTRADO */}
      <div style={s.container}>
        
        <h1 style={s.title}>Bienvenido a ForoHub</h1>
        
        <p style={s.desc}>
          La comunidad donde tus ideas conectan. Comparte conocimientos, 
          resuelve dudas y colabora con estudiantes de todo el mundo.
        </p>

        <div style={s.btnContainer}>
          <Link to="/login" style={s.btnWhite}>
            Iniciar Sesión
          </Link>
          <Link to="/register" style={s.btnGlass}>
            Registrarse &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}