const BASE_URL = 'http://localhost:8080';

async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Si es 204 (No Content) retornamos null
    if (response.status === 204) return null;
    
    const text = await response.text();
    // Si la respuesta está vacía, devolvemos null
    if (!text) return null;

    if (!response.ok) {
        try { 
            const errorObj = JSON.parse(text);
            throw errorObj;
        } catch (e) { 
            throw new Error(text || `Error ${response.status}`); 
        }
    }
    return JSON.parse(text);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// --- AUTH & USUARIOS ---
export const loginUser = (data) => apiRequest('/auth/login', 'POST', data);
export const registerUser = (data) => apiRequest('/auth/register', 'POST', data);
export const getMyProfile = () => apiRequest('/api/usuarios/me', 'GET');
export const updateMyProfile = (data) => apiRequest('/api/usuarios/me', 'PUT', data);

// --- TÓPICOS ---
export const getTopics = () => apiRequest('/api/topicos', 'GET');
export const createTopic = (data) => apiRequest('/api/topicos', 'POST', data);
export const likeTopic = (id) => apiRequest(`/api/topicos/${id}/like`, 'POST');
export const eliminarTopico = (id) => apiRequest(`/api/topicos/${id}`, 'DELETE');

// --- RESPUESTAS ---
export const getRespuestasPorTopico = (topicoId) => apiRequest(`/respuestas/topico/${topicoId}`, 'GET');
export const crearRespuesta = (data) => apiRequest('/respuestas', 'POST', data);
export const likeRespuesta = (id) => apiRequest(`/respuestas/${id}/like`, 'POST');
export const eliminarRespuesta = (id) => apiRequest(`/respuestas/${id}`, 'DELETE');

// --- AMISTADES ---
export const solicitarAmistad = (solicitanteId, receptorId) => 
    apiRequest(`/amistades/solicitar/${solicitanteId}`, 'POST', { receptorId });

//CORRECCIÓN AQUÍ:
export const responderAmistad = (amistadId, aceptar) => 
    apiRequest('/amistades/responder', 'POST', { 
        solicitudId: amistadId, // Debe coincidir con 'Long solicitudId' del DTO Java
        aceptar: aceptar        // Debe coincidir con 'boolean aceptar' del DTO Java
    });

// --- NOTIFICACIONES ---
export const getMyNotifications = (usuarioId) => apiRequest(`/api/notificaciones/usuario/${usuarioId}`, 'GET');
export const getMisNotificaciones = getMyNotifications; 
export const marcarNotificacionLeida = (id) => apiRequest(`/api/notificaciones/${id}/leer`, 'PUT');