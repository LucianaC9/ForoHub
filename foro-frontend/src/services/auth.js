// Guarda el token y el usuario en el navegador
export const login = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Borra todo al salir
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Recupera el usuario actual de forma segura
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    // Normalizamos el ID: si viene como 'usuarioId', lo copiamos a 'id'
    if (!user.id && user.usuarioId) {
        user.id = user.usuarioId;
    }
    return user;
  } catch (e) {
    console.error("Error al leer usuario:", e);
    return null;
  }
};