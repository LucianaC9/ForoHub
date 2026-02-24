import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile'; 
import Navbar from './components/Navbar'; 
import CreateTopic from './pages/CreateTopic'; 
// --- IMPORTACIÓN NUEVA PARA NOTIFICACIONES ---
import Notifications from './pages/Notifications'; 

// Layout para páginas internas (Feed, Perfil, Crear Tópico, Notificaciones)
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PÁGINAS PÚBLICAS (SIN NAVBAR, DISEÑO VIOLETA LIMPIO) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PÁGINAS PRIVADAS (CON NAVBAR Y FONDO NORMAL) */}
        <Route path="/feed" element={<MainLayout><Feed /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/crear-topico" element={<MainLayout><CreateTopic /></MainLayout>} />
        
        {/* --- RUTA NUEVA PARA NOTIFICACIONES --- */}
        <Route path="/notificaciones" element={<MainLayout><Notifications /></MainLayout>} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;