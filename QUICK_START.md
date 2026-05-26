# 🚀 Guía de Inicio Rápido

## 1. Instalar dependencias

```bash
npm install
```

## 2. Configurar la URL de la API

Edita el archivo `.env`:

```env
VITE_API_URL=http://tu-api.com
```

## 3. Asegúrate de que tu API tenga estos endpoints:

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

## 4. Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173

---

## 🧪 Probar la Aplicación

1. Abre http://localhost:5173
2. Usa tus credenciales de la API
3. Deberías ver el dashboard después de iniciar sesión
4. Las cookies se manejan automáticamente (HttpOnly)
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
