import React from 'react';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center text-white p-6">
      <div className="z-10 text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 p-4 rounded-2xl shadow-xl">
            <div style={{ fontSize: 44 }}>💬</div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Bienvenido a ForoHub</h1>

        <p className="text-lg md:text-xl text-indigo-200 mb-8">La comunidad donde tus ideas conectan. Comparte conocimientos, resuelve dudas y colabora.</p>

        <div className="flex gap-4 justify-center">
          <Link to="/login"><button className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold shadow-md">Iniciar Sesión</button></Link>
          <Link to="/register"><button className="px-8 py-4 bg-indigo-600/30 text-white rounded-full font-bold border border-indigo-400/20">Registrarse</button></Link>
        </div>
      </div>
    </div>
  );
}
