# 🚀 Guía de Inicio Rápido

## Opción 1: Con Mock API Server (Recomendado para pruebas)

### 1. Instalar dependencias del frontend
```bash
npm install
```

### 2. Instalar dependencias del mock server
```bash
npm install --package-lock-only --prefix . express cors jsonwebtoken
```

O manualmente:
```bash
npm install express cors jsonwebtoken
```

### 3. Iniciar el Mock Server (Terminal 1)
```bash
npm run server
# O directamente: node server-mock.js
```

El servidor estará disponible en http://localhost:3000

**Usuarios de prueba:**
- Email: `profesor@universidad.edu` | Password: `password123`
- Email: `admin@universidad.edu` | Password: `admin123`

### 4. Iniciar la aplicación React (Terminal 2)
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173

---

## Opción 2: Con tu propia API

### 1. Configurar la URL de la API
Edita el archivo `.env`:
```env
VITE_API_URL=http://tu-api.com
```

### 2. Asegúrate de que tu API tenga estos endpoints:

**POST /auth/login**
```json
// Request
{
  "email": "user@example.com",
  "password": "password"
}

// Response
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Nombre Usuario",
    "role": "rol"
  }
}
```

**GET /auth/me**
```json
// Headers: Authorization: Bearer <token>

// Response
{
  "id": 1,
  "email": "user@example.com",
  "name": "Nombre Usuario",
  "role": "rol"
}
```

### 3. Iniciar la aplicación
```bash
npm install
npm run dev
```

---

## 🧪 Probar la Aplicación

1. Abre http://localhost:5173
2. Usa las credenciales de prueba
3. Deberías ver el dashboard después de iniciar sesión
4. El token se guarda automáticamente en localStorage
5. Al refrescar la página, deberías seguir autenticado

---

## 📋 Checklist de Funcionalidades

- ✅ Login con email y password
- ✅ Validación de credenciales
- ✅ Almacenamiento de token JWT
- ✅ Rutas protegidas
- ✅ Redirección automática
- ✅ Logout
- ✅ Mostrar información del usuario
- ✅ UI responsive
- ✅ Manejo de errores
- ✅ Estados de carga

---

## 🐛 Troubleshooting

**Error: CORS**
- Asegúrate de que tu API tenga CORS habilitado
- El mock server ya tiene CORS configurado

**Error: Network Error**
- Verifica que la API esté corriendo
- Revisa la URL en el archivo `.env`

**Error: 401 Unauthorized**
- El token puede haber expirado
- Cierra sesión y vuelve a iniciar

**El dashboard no carga**
- Abre las DevTools del navegador
- Revisa la consola para ver errores
- Verifica que el endpoint `/auth/me` funcione correctamente
