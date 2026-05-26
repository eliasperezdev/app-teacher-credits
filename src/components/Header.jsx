import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : '??';

  const avatarUrl = user?.name
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e0e7ff&color=4f46e5&bold=true`
    : '';

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Panel Docente</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-right">
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{user?.name || 'Profesor'}</p>
            <p className="text-xs text-slate-500">{user?.email || ''}</p>
          </div>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-11 h-11 rounded-full border-2 border-indigo-100" />
          ) : (
            <div className="w-11 h-11 rounded-full border-2 border-indigo-100 bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-sm">{initials}</span>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl transition-colors cursor-pointer"
          title="Cerrar Sesión"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
