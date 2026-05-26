import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCommission } from '../hooks/useCommissions';
import { useSessions, useCreateSession } from '../hooks/useSessions';
import Header from '../components/Header';

const CommissionDetail = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [justCreated, setJustCreated] = useState(false);

  const { data, isLoading: loadingCommission } = useCommission(id);
  const { data: sessionsData, isLoading: loadingSessions, refetch: refetchSessions } = useSessions(id);
  const createSession = useCreateSession();

  const commission = data?.data;
  const sessions = sessionsData?.data ?? [];

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const openSession = sessions.find(
    (s) => !s.isClosed && s.sessionDate === today
  );

  const closedTodaySession = sessions.find(
    (s) => s.isClosed && s.sessionDate === today
  );

  const hasSessionToday = !!openSession || !!closedTodaySession;

  const handleStartClass = async () => {
    setError('');
    try {
      await createSession.mutateAsync({
        commissionId: id,
        notes: notes.trim() || undefined,
      });
      setJustCreated(true);
      await refetchSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar la sesión');
    }
  };

  if (loadingCommission || loadingSessions) {
    return (
      <div className="bg-zinc-50 text-slate-800 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Cargando comisión...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!commission) {
    return (
      <div className="bg-zinc-50 text-slate-800 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-8 text-center py-20">
          <p className="text-slate-400 text-lg">Comisión no encontrada</p>
          <Link to="/commissions" className="text-indigo-600 font-bold mt-4 inline-block">
            ← Volver a Comisiones
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 text-slate-800 min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/commissions"
            className="text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 p-2.5 rounded-xl transition-colors cursor-pointer"
            title="Volver al Panel"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {commission.subject?.name || 'Materia'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Comisión {commission.name}
              {openSession && (
                <span className="ml-2 text-emerald-600">• Sesión en curso</span>
              )}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-8">
        {openSession ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Sesión Abierta</h2>
            <p className="text-slate-500">
              Sesión iniciada a las {new Date(openSession.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              {openSession.notes && <span> — {openSession.notes}</span>}
            </p>
            <p className="text-sm text-indigo-600 font-bold mt-4">Consola de clase — Próximamente</p>
          </div>
        ) : closedTodaySession ? (
          <section className="max-w-lg mx-auto bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Clase Finalizada</h2>
            <p className="text-sm text-slate-500">
              Ya se cerró una sesión hoy a las {new Date(closedTodaySession.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              {closedTodaySession.notes && <span> — {closedTodaySession.notes}</span>}
            </p>
            <p className="text-sm text-slate-400 font-bold mt-4">No se pueden abrir más sesiones hoy</p>
          </section>
        ) : (
          <section className="max-w-lg mx-auto bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Iniciar Clase de Hoy</h2>
            <p className="text-sm text-slate-500 mb-6">
              {now.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Notas (opcional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Clase de repaso, Práctica parcial..."
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-4">{error}</p>
            )}

            <button
              onClick={handleStartClass}
              disabled={createSession.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-4 rounded-2xl transition-colors cursor-pointer text-lg shadow-lg shadow-indigo-200"
            >
              {createSession.isPending ? 'Iniciando...' : 'Iniciar Clase'}
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default CommissionDetail;
