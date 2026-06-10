import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCommission } from '../hooks/useCommissions';
import { useSessions, useCreateSession, useCloseSession } from '../hooks/useSessions';
import { useSession } from '../hooks/useSessions';
import { useRaffles, useCreateRaffle, useResolveRaffleResult, useRerunRaffle, useCorrectRaffleResult } from '../hooks/useRaffles';
import { useGroups } from '../hooks/useGroups';
import { useReverseCredit } from '../hooks/useCredits';
import Header from '../components/Header';

const CommissionDetail = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading: loadingCommission } = useCommission(id);
  const { data: sessionsData, isLoading: loadingSessions, refetch: refetchSessions } = useSessions(id);
  const createSession = useCreateSession();
  const closeSession = useCloseSession();

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

  const handleStartClass = async () => {
    setError('');
    try {
      await createSession.mutateAsync({
        commissionId: id,
        notes: notes.trim() || undefined,
      });
      await refetchSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar la sesión');
    }
  };

  const handleCloseClass = async () => {
    if (!confirm('¿Cerrar la sesión de hoy?')) return;
    try {
      await closeSession.mutateAsync(openSession.id);
      await refetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cerrar la sesión');
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

  if (openSession) {
    return (
      <ClassConsole
        commission={commission}
        session={openSession}
        onCloseClass={handleCloseClass}
        closingSession={closeSession.isPending}
      />
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
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-8">
        {closedTodaySession ? (
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

const ClassConsole = ({ commission, session, onCloseClass, closingSession }) => {
  const { data: rafflesData } = useRaffles(session.id);
  const { data: sessionDetailData } = useSession(session.id);
  const { data: groupsData } = useGroups(commission.id);
  const createRaffle = useCreateRaffle();
  const resolveResult = useResolveRaffleResult();
  const rerunRaffle = useRerunRaffle();
  const reverseCredit = useReverseCredit();
  const correctResult = useCorrectRaffleResult();

  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [undoError, setUndoError] = useState('');
  const [showRaffleWarning, setShowRaffleWarning] = useState(false);
  const [pendingRaffleAction, setPendingRaffleAction] = useState(null);
  const [correctModal, setCorrectModal] = useState(null);

  const raffles = rafflesData?.data ?? [];
  const sessionDetail = sessionDetailData?.data;
  const creditEvents = sessionDetail?.creditEvents ?? [];
  const groups = groupsData?.data ?? [];
  const latestRaffle = raffles.length > 0 ? raffles[raffles.length - 1] : null;

  const allActiveResults = raffles.flatMap((r) =>
    r.results.filter((res) =>
      res.status === 'PENDING' ||
      res.status === 'ABSENT' ||
      res.status === 'SKIPPED'
    )
  );

  const pendingResults = allActiveResults.filter((r) => r.status === 'PENDING');
  const absentOrSkippedResults = allActiveResults.filter((r) =>
    r.status === 'ABSENT' || r.status === 'SKIPPED'
  );

  const usedGroupIds = new Set(
    raffles.flatMap((r) =>
      r.results
        .filter((res) => res.status !== 'PENDING' && res.status !== 'REPLACED')
        .map((res) => res.group.id)
    )
  );

  const availableGroups = groups.filter(
    (g) => g.isActive && !usedGroupIds.has(g.id)
  );

  const hasAbsentOrSkipped = absentOrSkippedResults.length > 0;

  const availableCount = availableGroups.length;
  const noGroupsAvailable = availableCount === 0;

  const cappedQuantity = Math.min(quantity, Math.max(1, availableCount));

  const handleUndo = async () => {
    setUndoError('');
    if (!lastCreditEvent) return;
    if (lastCreditEvent.isReversal) {
      setUndoError('Este evento ya fue revertido');
      return;
    }
    if (!confirm(`¿Deshacer el crédito de ${lastCreditEvent.group?.name || 'este grupo'}?`)) return;
    try {
      await reverseCredit.mutateAsync(lastCreditEvent.id);
    } catch (err) {
      if (err.response?.status === 409) {
        setUndoError('Este crédito ya fue revertido anteriormente');
      } else {
        setUndoError(err.response?.data?.message || 'Error al deshacer');
      }
    }
  };

  const handleRerunAbsentOrSkipped = async () => {
    if (absentOrSkippedResults.length === 0 || !latestRaffle) return;
    setError('');
    try {
      await rerunRaffle.mutateAsync({
        sessionId: session.id,
        raffleId: latestRaffle.id,
        resultIds: absentOrSkippedResults.map((r) => r.id),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al re-sortear ausentes/omitidos');
    }
  };

  const handleDismissAbsentOrSkipped = async () => {
    if (absentOrSkippedResults.length === 0) return;
    setError('');
    try {
      for (const result of absentOrSkippedResults) {
        await resolveResult.mutateAsync({ resultId: result.id, status: result.status });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al descartar grupos');
    }
  };

  const handleLaunchRaffleWithCheck = () => {
    if (pendingResults.length > 0) {
      setError('Resolvé los grupos pendientes antes de lanzar un nuevo sorteo');
      return;
    }
    if (hasAbsentOrSkipped) {
      setPendingRaffleAction(() => () => {
        return createRaffle.mutateAsync({
          sessionId: session.id,
          quantity: cappedQuantity,
        });
      });
      setShowRaffleWarning(true);
    } else if (noGroupsAvailable) {
      setError('No hay grupos disponibles para sortear');
    } else {
      handleLaunchRaffle();
    }
  };

  const handleLaunchRaffle = async () => {
    setError('');
    try {
      await createRaffle.mutateAsync({
        sessionId: session.id,
        quantity: cappedQuantity,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al lanzar el sorteo');
    }
  };

  const handleResolve = async (resultId, status) => {
    try {
      await resolveResult.mutateAsync({ resultId, status });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al resolver');
    }
  };

  const handleCorrect = async (resultId, newStatus) => {
    try {
      await correctResult.mutateAsync({ resultId, newStatus });
      setCorrectModal(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al corregir');
    }
  };

  const raffleHistory = raffles.flatMap((r) =>
    r.results.map((res) => ({
      ...res,
      type: 'raffle',
      raffleId: r.id,
      roundNumber: r.roundNumber,
      createdAt: res.resolvedAt || r.createdAt,
    }))
  );

  const creditHistory = creditEvents
    .filter((e) => !e.raffleResult)
    .filter((e, i, arr) => arr.findIndex((x) => x.id === e.id) === i)
    .map((e) => ({
      ...e,
      type: 'credit',
    }));

  const reversedIds = new Set(
    creditEvents.filter((e) => e.isReversal).map((e) => e.reversedById).filter(Boolean)
  );

  const lastCreditEvent = creditEvents
    .filter((e) => !e.isReversal && !reversedIds.has(e.id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] ?? null;

  const allHistory = [...raffleHistory, ...creditHistory]
    .sort((a, b) => new Date(b.createdAt || b.resolvedAt) - new Date(a.createdAt || a.resolvedAt));

  const participatedCount = raffleHistory.filter((h) => h.status === 'PARTICIPATED').length;
  const absentCount = raffleHistory.filter((h) => h.status === 'ABSENT').length;

  return (
    <div className="bg-zinc-50 text-slate-800 min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-indigo-100 text-indigo-700 p-2 rounded-xl hidden sm:block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {commission.subject?.name || 'Materia'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Comisión {commission.name} • Sesión en curso
              {hasAbsentOrSkipped && (
                <span className="ml-2 text-amber-600 font-bold">
                  • {absentOrSkippedResults.length} grupo{absentOrSkippedResults.length !== 1 ? 's' : ''} para re-sortear
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/commissions"
            className="text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 p-2.5 rounded-xl transition-colors cursor-pointer"
            title="Volver a Comisiones"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <button
            onClick={onCloseClass}
            disabled={closingSession}
            className="text-slate-400 hover:text-slate-700 font-medium p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <span className="hidden sm:inline">{closingSession ? 'Cerrando...' : 'Cerrar Sesión'}</span>
            <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 flex flex-col xl:grid xl:grid-cols-12 gap-6 items-start">
        {/* Left: Raffle Panel */}
        <aside className="w-full xl:col-span-3 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg> Nuevo Sorteo
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Cantidad de grupos
                <span className="ml-2 text-xs font-medium text-slate-400">
                  ({availableCount} disponible{availableCount !== 1 ? 's' : ''})
                </span>
              </label>
              <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-200 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={noGroupsAvailable}
                  className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-white rounded-xl hover:shadow-sm transition-all cursor-pointer font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="flex-1 text-center bg-transparent font-black text-2xl text-slate-800">{cappedQuantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={noGroupsAvailable || cappedQuantity >= availableCount}
                  className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-white rounded-xl hover:shadow-sm transition-all cursor-pointer font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}

          {noGroupsAvailable && raffles.length > 0 ? (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-2xl py-3 px-4 text-center">
              <p className="text-sm font-bold text-amber-700">Todos los grupos ya participaron hoy</p>
            </div>
          ) : noGroupsAvailable ? (
            <div className="mt-2 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-center">
              <p className="text-sm font-bold text-slate-500">No hay grupos creados</p>
            </div>
          ) : null}

          <button
            onClick={handleLaunchRaffleWithCheck}
            disabled={createRaffle.isPending || noGroupsAvailable || pendingResults.length > 0}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-2xl py-4 text-lg font-bold w-full shadow-lg shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            {createRaffle.isPending ? 'Sorteando...' : pendingResults.length > 0 ? 'Resolvé pendientes primero' : noGroupsAvailable ? 'Sin grupos disponibles' : 'Lanzar Sorteo'}
          </button>

          {hasAbsentOrSkipped && (
            availableCount === 0 ? (
              <div className="flex flex-col gap-2">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl py-3 px-4 text-center">
                  <p className="text-sm font-bold text-rose-700">No hay grupos disponibles para reemplazar</p>
                  <p className="text-xs text-rose-500 mt-1">Los grupos ausentes/omitidos no pueden ser re-sorteados</p>
                </div>
                <button
                  onClick={handleDismissAbsentOrSkipped}
                  disabled={resolveResult.isPending}
                  className="bg-slate-50 hover:bg-slate-100 disabled:bg-slate-100 text-slate-600 border border-slate-200 rounded-2xl py-3 text-sm font-bold w-full transition-colors cursor-pointer disabled:opacity-50"
                >
                  Descartar grupos pendientes
                </button>
              </div>
            ) : (
              <button
                onClick={handleRerunAbsentOrSkipped}
                disabled={rerunRaffle.isPending}
                className="bg-amber-50 hover:bg-amber-100 disabled:bg-slate-100 text-amber-700 border border-amber-200 rounded-2xl py-3 text-sm font-bold w-full transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Re-sortear ausentes/omitidos ({absentOrSkippedResults.length})
              </button>
            )
          )}
        </aside>

        {/* Center: Selected Groups */}
        <section className="w-full xl:col-span-6 flex flex-col gap-4">
          <div className="flex justify-between items-end px-2 mb-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">Grupos Seleccionados</h2>
              <p className="text-slate-500 text-sm mt-1">
                {allActiveResults.length > 0
                  ? `${pendingResults.length} pendiente${pendingResults.length !== 1 ? 's' : ''}${absentOrSkippedResults.length > 0 ? ` • ${absentOrSkippedResults.length} para re-sortear` : ''}`
                  : raffles.length > 0
                    ? 'Todos los grupos resueltos'
                    : 'Sin sorteos aún'}
              </p>
            </div>
          </div>

          {allActiveResults.length === 0 && raffles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center">
              <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-400 font-medium">Lanzá un sorteo para comenzar</p>
            </div>
          ) : allActiveResults.length === 0 && raffles.length > 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
              <svg className="w-8 h-8 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-500 font-medium">Todos los grupos de esta ronda fueron resueltos</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allActiveResults.map((result) => (
                <RaffleResultRow
                  key={result.id}
                  result={result}
                  onResolve={handleResolve}
                  onRerun={absentOrSkippedResults.length > 0 ? handleRerunAbsentOrSkipped : undefined}
                  noGroupsAvailable={noGroupsAvailable}
                />
              ))}
            </div>
          )}

          {/* Previous rounds */}
          {raffleHistory.filter((h) => h.status === 'PARTICIPATED' || h.status === 'ABSENT' || h.status === 'SKIPPED' || h.status === 'REPLACED').length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Resueltos</h3>
              <div className="flex flex-col gap-2">
                {raffleHistory
                  .filter((h) => h.status === 'PARTICIPATED' || h.status === 'ABSENT' || h.status === 'SKIPPED' || h.status === 'REPLACED')
                  .slice(-10)
                  .reverse()
                  .map((h) => (
                    <div
                      key={`resolved-${h.id}`}
                      className={`bg-white border rounded-xl p-3 flex items-center justify-between text-sm group ${
                        h.status === 'REPLACED' ? 'border-slate-100 opacity-60' : 'border-slate-100'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-700">{h.group.name}</span>
                        <span className="text-slate-400 text-xs ml-2">Ronda {h.roundNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-md ${
                            h.status === 'PARTICIPATED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : h.status === 'ABSENT'
                              ? 'bg-rose-100 text-rose-700'
                              : h.status === 'SKIPPED'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {h.status === 'PARTICIPATED' ? 'Participo' : h.status === 'ABSENT' ? 'Ausente' : h.status === 'SKIPPED' ? 'Omitido' : 'Re-sort'}
                        </span>
                        {h.status !== 'REPLACED' && (
                          <button
                            onClick={() => setCorrectModal(h)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-all p-1 cursor-pointer"
                            title="Corregir"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>

        {/* Right: Undo & Live Feed */}
        <aside className="w-full xl:col-span-3 flex flex-col gap-4 h-full">
          <button
            onClick={handleUndo}
            disabled={!lastCreditEvent || lastCreditEvent.isReversal || reversedIds.has(lastCreditEvent.id) || reverseCredit.isPending}
            className="bg-amber-100 hover:bg-amber-200 disabled:bg-slate-100 text-amber-800 disabled:text-slate-400 border-2 border-amber-200/50 disabled:border-slate-200 rounded-2xl py-3 px-4 font-bold flex justify-center items-center gap-3 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Deshacer última acción
          </button>

          {undoError && (
            <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-4 py-3">{undoError}</p>
          )}

          {participatedCount > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-black text-emerald-600">{participatedCount}</p>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Participaron</p>
              </div>
              <div>
                <p className="text-2xl font-black text-rose-600">{absentCount}</p>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Ausentes</p>
              </div>
              <div>
                <p className="text-2xl font-black text-indigo-600">{raffles.length}</p>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Rondas</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
              </svg> Registro en vivo
            </h3>

            <div className="space-y-5 flex-1 overflow-y-auto pr-2">
              {allHistory.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Sin acciones registradas</p>
              ) : (
                allHistory.slice(0, 20).map((h) => {
                  const isRaffle = h.type === 'raffle';
                  const isParticipated = h.status === 'PARTICIPATED';
                  const isAbsent = h.status === 'ABSENT';
                  const isSkipped = h.status === 'SKIPPED';
                  const isReplaced = h.status === 'REPLACED';
                  const isCredit = h.type === 'credit';
                  const isReversal = h.isReversal === true;
                  const wasReversed = reversedIds.has(h.id);

                  if (wasReversed) return null;

                  return (
                    <div
                      key={`${h.type}-${h.id}`}
                      className={`relative pl-6 border-l-2 ${
                        isReversal
                          ? 'border-amber-200'
                          : isAbsent
                          ? 'border-rose-200'
                          : isParticipated || isCredit
                          ? 'border-emerald-200'
                          : 'border-slate-200'
                      } ${isReplaced ? 'opacity-50' : ''}`}
                    >
                      <div
                        className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-4 border-white ${
                          isReversal
                            ? 'bg-amber-500'
                            : isAbsent
                            ? 'bg-rose-500'
                            : isParticipated || isCredit
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                        }`}
                      ></div>
                      <p className="text-sm font-bold text-slate-800">
                        {h.group?.name || 'Grupo'}{' '}
                        {isReversal && (
                          <span className="text-amber-600 font-black">Crédito revertido</span>
                        )}
                        {isParticipated && !isReversal && (
                          <span className="text-emerald-600 font-black">+1 crédito</span>
                        )}
                        {isAbsent && (
                          <span className="text-rose-600 font-black">Ausente</span>
                        )}
                        {isSkipped && (
                          <span className="text-slate-500 font-black">Omitido</span>
                        )}
                        {isReplaced && (
                          <span className="text-slate-400 font-black">Re-sort</span>
                        )}
                        {isCredit && !isReversal && (
                          <span className="text-emerald-600 font-black">+{h.amount} crédito</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isRaffle && `Ronda ${h.roundNumber} • `}
                        {new Date(h.resolvedAt || h.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </main>

      {showRaffleWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-800 text-center mb-2">Hay grupos sin resolver</h2>
            <p className="text-sm text-slate-500 text-center mb-4">
              {absentOrSkippedResults.length} grupo{absentOrSkippedResults.length !== 1 ? 's' : ''} 
              {absentOrSkippedResults.length !== 1 ? ' faltaron o fueron omitidos' : ' faltó o fue omitido'} en el sorteo actual.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
              <p className="text-sm font-medium text-amber-800 text-center">
                <span className="font-bold">Grupos:</span>{' '}
                {absentOrSkippedResults.map((r) => r.group.name).join(', ')}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowRaffleWarning(false);
                  setPendingRaffleAction(null);
                  handleRerunAbsentOrSkipped();
                }}
                disabled={noGroupsAvailable}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500"
              >
                {noGroupsAvailable ? 'Sin grupos disponibles' : 'Re-sortear estos grupos'}
              </button>
              <button
                onClick={async () => {
                  setShowRaffleWarning(false);
                  try {
                    for (const result of absentOrSkippedResults) {
                      await resolveResult.mutateAsync({ resultId: result.id, status: result.status });
                    }
                    if (pendingRaffleAction) {
                      await pendingRaffleAction();
                    }
                  } catch (err) {
                    setError(err.response?.data?.message || 'Error al procesar');
                  }
                  setPendingRaffleAction(null);
                }}
                disabled={noGroupsAvailable}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
              >
                {noGroupsAvailable ? 'Sin grupos disponibles' : 'Descartar pendientes y hacer sorteo nuevo'}
              </button>
              <button
                onClick={() => {
                  setShowRaffleWarning(false);
                  setPendingRaffleAction(null);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {correctModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Corregir Estado</h3>
            <p className="text-sm text-slate-500 mb-1">
              Grupo: <span className="font-bold">{correctModal.group.name}</span>
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Estado actual: <span className={`font-bold ${
                correctModal.status === 'PARTICIPATED' ? 'text-emerald-600' :
                correctModal.status === 'ABSENT' ? 'text-rose-600' :
                'text-slate-500'
              }`}>
                {correctModal.status === 'PARTICIPATED' ? 'Participó' :
                 correctModal.status === 'ABSENT' ? 'Ausente' :
                 correctModal.status === 'SKIPPED' ? 'Omitido' : 'Reemplazado'}
              </span>
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-amber-700">
                Esta acción ajustará los créditos automáticamente y quedará registrada en el historial.
              </p>
            </div>

            <div className="space-y-2">
              {correctModal.status !== 'PARTICIPATED' && (
                <button
                  onClick={() => handleCorrect(correctModal.id, 'PARTICIPATED')}
                  disabled={correctResult.isPending}
                  className="w-full flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span>Marcar como Participó</span>
                  <span className="text-xs font-medium text-emerald-600">+1 crédito</span>
                </button>
              )}
              {correctModal.status !== 'ABSENT' && (
                <button
                  onClick={() => handleCorrect(correctModal.id, 'ABSENT')}
                  disabled={correctResult.isPending}
                  className="w-full flex items-center justify-between bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span>Marcar como Ausente</span>
                  <span className="text-xs font-medium text-rose-600">-1 crédito</span>
                </button>
              )}
              {correctModal.status !== 'SKIPPED' && (
                <button
                  onClick={() => handleCorrect(correctModal.id, 'SKIPPED')}
                  disabled={correctResult.isPending}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span>Marcar como Omitido</span>
                  <span className="text-xs font-medium text-slate-500">Sin cambio</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setCorrectModal(null)}
              className="w-full mt-4 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const RaffleResultRow = ({ result, onResolve, onRerun, noGroupsAvailable }) => {
  const group = result.group;
  const isAbsent = result.status === 'ABSENT';
  const isSkipped = result.status === 'SKIPPED';
  const isResolved = isAbsent || isSkipped;

  return (
    <div className={`bg-white border-2 rounded-2xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm transition-colors ${
      isAbsent ? 'border-rose-200 bg-rose-50/30' :
      isSkipped ? 'border-slate-200 bg-slate-50/30' :
      'border-indigo-50 hover:border-indigo-100'
    }`}>
      <div className="flex-1 w-full">
        <div className="flex items-center gap-3 mb-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
            isAbsent ? 'bg-rose-100 text-rose-700' :
            isSkipped ? 'bg-slate-100 text-slate-500' :
            'bg-indigo-100 text-indigo-700'
          }`}>
            G-{group.id?.substring(0, 4).toUpperCase()}
          </span>
          <h3 className="text-lg font-bold text-slate-800">{group.name}</h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md ml-auto lg:ml-0">
            {group.totalCredits} Cred
          </span>
          {isResolved && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              isAbsent ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {isAbsent ? 'Ausente' : 'Omitido'}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500">{group.memberCount} integrantes</p>
      </div>

      {isResolved ? (
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <span className="text-sm text-slate-400 italic">Esperando re-sorteo...</span>
          {onRerun && (
            <button
              onClick={onRerun}
              disabled={noGroupsAvailable}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white border border-amber-200 hover:border-amber-500 font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-50 disabled:hover:text-amber-600 disabled:hover:border-amber-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm">{noGroupsAvailable ? 'Sin grupos' : 'Re-sortear'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => onResolve(result.id, 'PARTICIPATED')}
            disabled={result.status !== 'PENDING'}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-50 disabled:hover:text-emerald-600 disabled:hover:border-emerald-200"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">+</span>
            <span className="text-sm">Sumar</span>
          </button>
          <button
            onClick={() => onResolve(result.id, 'ABSENT')}
            disabled={result.status !== 'PENDING'}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-500 font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-50 disabled:hover:text-rose-600 disabled:hover:border-rose-200"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">-</span>
            <span className="text-sm">Falta</span>
          </button>
          <button
            onClick={() => onResolve(result.id, 'SKIPPED')}
            disabled={result.status !== 'PENDING'}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-200 text-slate-600 border border-slate-200 font-semibold py-2.5 px-3 rounded-xl transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-50 disabled:hover:text-slate-600 disabled:hover:border-slate-200"
            title="Omitir sin penalizar"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">~</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CommissionDetail;
