import React, { useEffect, useState, useRef } from 'react';
import { getMyProfile, updateMyProfile } from '../services/api';

export default function Profile() {
  const [user, setUser] = useState({ nombre: '', email: '', foto: '' });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const data = await getMyProfile();
      if (data) {
        setUser({ 
            nombre: data.nombreUsuario || '', 
            email: data.email || '',
            foto: data.foto || '' 
        });
        if (data.foto) setPhotoPreview(data.foto);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Límite 2MB
          alert("La imagen es muy pesada. Máximo 2MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setUser(prev => ({ ...prev, foto: reader.result })); // Guardamos Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const payload = {
        nombreUsuario: user.nombre,
        email: user.email,
        foto: user.foto, // <--- Enviamos la foto al backend
        ...(passwords.newPassword ? { password: passwords.newPassword } : {})
      };
      
      await updateMyProfile(payload);
      alert("¡Perfil actualizado con éxito!");
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (error) { 
        console.error(error);
        alert("Error al actualizar perfil."); 
    }
  };

  const s = {
    wrapper: { minHeight: '100vh', background: '#0f172a', paddingTop: '100px', display: 'flex', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif", color: 'white' },
    card: { background: '#1e293b', width: '90%', maxWidth: '600px', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', border: '1px solid #334155', height: 'fit-content' },
    header: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #334155', paddingBottom: '20px' },
    avatarWrapper: { position: 'relative', cursor: 'pointer', marginBottom: '15px', transition: 'transform 0.2s' },
    avatarBig: { width: '120px', height: '120px', background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', color: 'white', border: '4px solid #0f172a', overflow: 'hidden', objectFit: 'cover' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    cameraIcon: { position: 'absolute', bottom: '5px', right: '5px', background: '#22c55e', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #1e293b', color: 'white', fontSize: '1rem' },
    title: { margin: 0, fontSize: '1.5rem', fontWeight: 'bold' },
    subtitle: { margin: '5px 0 0 0', color: '#94a3b8', fontSize: '0.9rem' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', color: '#cbd5e1', borderLeft: '4px solid #7c3aed', paddingLeft: '10px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' },
    input: { width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '1rem', outline: 'none' },
    btnSave: { width: '100%', padding: '14px', borderRadius: '50px', border: 'none', background: '#7c3aed', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' },
    btnPhoto: { background: 'transparent', border: 'none', color: '#a78bfa', cursor: 'pointer', fontSize: '0.9rem', marginTop: '5px', textDecoration: 'underline' }
  };

  if (loading) return <div style={s.wrapper}>Cargando...</div>;

  return (
    <div style={s.wrapper}>
      <form style={s.card} onSubmit={handleUpdate}>
        <div style={s.header}>
          <div style={s.avatarWrapper} onClick={() => fileInputRef.current.click()}>
            {photoPreview ? (
               <img src={photoPreview} style={s.avatarImg} alt="Avatar" />
            ) : (
               <div style={s.avatarBig}>{user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}</div>
            )}
            <div style={s.cameraIcon}>📷</div>
          </div>
          
          <input type="file" ref={fileInputRef} style={{display: 'none'}} accept="image/*" onChange={handlePhotoSelect} />
          <button type="button" onClick={() => fileInputRef.current.click()} style={s.btnPhoto}>Cambiar foto de perfil</button>

          <h2 style={s.title}>{user.nombre}</h2>
          <p style={s.subtitle}>{user.email}</p>
        </div>

        <h3 style={s.sectionTitle}>Datos Personales</h3>
        <div style={s.formGroup}><label style={s.label}>Nombre de Usuario</label><input style={s.input} value={user.nombre} onChange={(e) => setUser({...user, nombre: e.target.value})}/></div>
        <div style={s.formGroup}><label style={s.label}>Correo Electrónico</label><input style={s.input} value={user.email} onChange={(e) => setUser({...user, email: e.target.value})}/></div>
        <h3 style={s.sectionTitle}>Seguridad</h3>
        <div style={s.formGroup}><label style={s.label}>Nueva Contraseña</label><input type="password" placeholder="Dejar vacío para mantener" style={s.input} value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}/></div>
        <div style={s.formGroup}><label style={s.label}>Confirmar Contraseña</label><input type="password" placeholder="Repetir contraseña" style={s.input} value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}/></div>
        <button type="submit" style={s.btnSave}>Guardar Cambios</button>
      </form>
    </div>
  );
}