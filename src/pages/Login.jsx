import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoginLoading, loginError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="bg-zinc-50 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <main className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 sm:p-10 relative z-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 mb-6 transform rotate-3">
            <svg
              className="w-8 h-8 text-white -rotate-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Bienvenido</h1>
          <p className="text-slate-500 font-medium mt-2">Ingresa tus credenciales docentes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
              {loginError.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="profesor@universidad.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
              required
              disabled={isLoginLoading}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-700">Contraseña</label>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
              required
              disabled={isLoginLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoginLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl py-4 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
          >
            {isLoginLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Iniciando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
