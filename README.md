# Sistema de Participación - Frontend

Sistema de autenticación con React, Vite, Tailwind CSS y React Query.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **React Query (@tanstack/react-query)** - Gestión de estado del servidor
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP

## 📋 Características

- ✅ Autenticación completa (login/logout)
- ✅ Rutas protegidas
- ✅ Manejo de tokens JWT
- ✅ Interceptores de Axios
- ✅ Context API para estado global
- ✅ React Query para cache y sincronización
- ✅ Diseño responsive con Tailwind
- ✅ UI moderna basada en el diseño proporcionado

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Configurar la URL de tu API en .env
# VITE_API_URL=http://localhost:3000
```

## 🏃‍♂️ Ejecución

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── api/
│   ├── axios.js          # Axios + interceptores + refresh automático
│   └── auth.js           # Servicios de autenticación
├── components/
│   ├── ProtectedRoute.jsx # Rutas protegidas
│   ├── Header.jsx         # Header con info del usuario
│   └── ...
├── contexts/
│   └── AuthContext.jsx   # Context de autenticación
├── pages/
│   ├── Login.jsx
│   ├── CommissionDashboard.jsx
│   ├── CommissionDetail.jsx
│   ├── CommissionManagement.jsx
│   └── CommissionHistory.jsx
├── hooks/                 # Custom hooks con React Query
├── App.jsx               # Configuración de rutas
└── main.jsx              # Punto de entrada
```

## 🔐 API Endpoints Esperados

El frontend espera que el backend tenga los siguientes endpoints:

### POST /auth/login
```json
// Request
{
  "email": "profesor@universidad.edu",
  "password": "password123"
}

// Response (cookies HttpOnly seteadas automáticamente)
{
  "data": {
    "teacher": {
      "id": "uuid",
      "email": "profesor@universidad.edu",
      "name": "Juan Pérez"
    }
  }
}
```

### GET /auth/me
```json
// Cookies enviadas automáticamente (credentials: include)

// Response
{
  "data": {
    "teacher": {
      "id": "uuid",
      "email": "profesor@universidad.edu",
      "name": "Juan Pérez"
    }
  }
}
```

## 🎨 Diseño

El diseño está basado en el archivo HTML proporcionado con:
- Colores: Indigo (principal), Slate (textos y bordes)
- Tipografía: Inter (Google Fonts)
- Bordes redondeados: 2xl (grandes), xl (medianos)
- Sombras suaves y degradados de fondo

## 🔑 Autenticación

El sistema utiliza:
1. **Cookies HttpOnly** para access token (15 min) y refresh token (7 días)
2. **Interceptores de Axios** con `credentials: include` y refresh automático en 401
3. **AuthContext** para gestionar el estado de autenticación
4. **React Query** para cachear datos del usuario
5. **Redirección automática** en caso de refresh fallido

## 📝 Notas de Desarrollo

- Las cookies son HttpOnly y Secure en producción; JavaScript no puede acceder a ellas
- Axios envía `credentials: include` en todas las peticiones
- Si una petición devuelve 401, se intenta refresh automáticamente antes de redirigir a `/login`
- Las rutas protegidas muestran un spinner mientras se verifica la autenticación
- React Query cachea la información del usuario por 5 minutos

## 🚧 Próximas Funcionalidades

- [ ] Recuperación de contraseña
- [ ] Registro de usuarios
- [ ] Gestión de participaciones
- [ ] CRUD de estudiantes
- [ ] Sistema de reportes
- [ ] Notificaciones en tiempo real

## 📄 Licencia

MIT
