// Mock API Server para desarrollo
// Ejecutar con: node server-mock.js

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'tu-clave-secreta-super-segura';

app.use(cors());
app.use(express.json());

// Base de datos en memoria
const users = [
  {
    id: 1,
    email: 'profesor@universidad.edu',
    password: 'password123', // En producción, usar bcrypt
    name: 'Juan Pérez',
    role: 'profesor',
  },
  {
    id: 2,
    email: 'admin@universidad.edu',
    password: 'admin123',
    name: 'María González',
    role: 'administrador',
  },
];

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// POST /auth/login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos' });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '24h' });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

// GET /auth/me
app.get('/auth/me', verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.userId);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

// Endpoint de prueba
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock API Server funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API Server corriendo en http://localhost:${PORT}`);
  console.log('\nUsuarios de prueba:');
  console.log('1. profesor@universidad.edu / password123');
  console.log('2. admin@universidad.edu / admin123');
});
