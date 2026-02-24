# 💬 ForoHub

ForoHub es una plataforma interactiva diseñada para que la comunidad comparta conocimientos, resuelva dudas y colabore. Este proyecto Full Stack fue desarrollado como parte de mi formación en la Tecnicatura en Informática de la UNLaR, integrando una API RESTful robusta con una interfaz de usuario dinámica y fluida.

## 🚀 Características Principales

* **Autenticación Segura:** Registro e inicio de sesión de usuarios protegidos mediante Spring Security y tokens JWT.
* **Gestión de Tópicos y Respuestas:** Sistema completo (CRUD) para crear, leer, actualizar y eliminar hilos de discusión y comentarios.
* **Experiencia de Usuario Fluida (Optimistic UI):** Sistema de "Me gusta" en tópicos y respuestas con actualización visual instantánea, respaldado por persistencia segura en la base de datos.
* **Sistema de Notificaciones:** Alertas automáticas e integradas para los autores de los tópicos cuando reciben interacciones o comentarios nuevos.
* **Comunidad:** Capacidad para enviar solicitudes de amistad y conectar con otros desarrolladores dentro de la plataforma.

## 💻 Tecnologías Utilizadas

### Frontend
* **Librería principal:** React (inicializado con Vite)
* **Enrutamiento:** React Router DOM
* **Estilos:** CSS / TailwindCSS
* **Arquitectura:** Consumo de APIs mediante servicios asíncronos y gestión de estados complejos con Hooks.

### Backend
* **Lenguaje:** Java
* **Framework:** Spring Boot
* **Seguridad:** Spring Security (Stateless, JWT)
* **Persistencia:** Hibernate / Spring Data JPA
* **Base de Datos:** MySQL
* **Documentación:** Swagger / SpringDoc

## 🛠️ Instalación y Uso Local

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### 1. Configurar el Backend (Java)
1. Abre la carpeta `backend` en tu IDE (IntelliJ, Eclipse, VS Code).
2. Configura tus credenciales locales de MySQL y tu clave secreta para JWT en el archivo `src/main/resources/application.properties`.
3. Ejecuta la clase principal `ForohubApplication`. El servidor iniciará en el puerto `8080`.

### 2. Configurar el Frontend (React)
1. Abre una terminal y navega hasta la carpeta `frontend`.
2. Instala las dependencias ejecutando: `npm install`
3. Inicia el servidor de desarrollo con: `npm run dev`
4. Abre la URL local que te proporcione Vite en tu navegador.



## 📸 Demostración****
[PruebaForoHub.webm](https://github.com/user-attachments/assets/598f3418-7f1f-4a6a-b3c1-f444c5a88897)




## 👨‍💻 Autora

* **LucianaC9** - *Desarrolladora Backend* - [Mi perfil de LinkedIn](https://www.linkedin.com/in/luciana-carrizo-16041b35a/)
