import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCreditSummary } from '../hooks/useCredits';
import { useCommission } from '../hooks/useCommissions';
import Header from '../components/Header';

const CommissionHistory = () => {
  const { id } = useParams();
  const { data: commissionData, isLoading: loadingCommission } = useCommission(id);
  const { data: creditSummaryData, isLoading: loadingCredits } = useCreditSummary(id);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const commission = commissionData?.data;
  const creditSummary = creditSummaryData?.data;
  const groups = creditSummary?.groups ?? [];
  const creditValue = creditSummary?.creditValue ?? 0;

  const allEvents = [];
  for (const group of groups) {
    for (const member of group.members) {
      allEvents.push({
        id: member.id,
        type: 'member',
        group: group.name,
        groupId: group.id,
        name: `${member.lastName}, ${member.firstName}`,
        totalCredits: member.totalCredits,
        pointsValue: member.pointsValue,
        isActive: group.isActive,
      });
    }
  }

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      search === '' ||
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.group.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'active' && event.isActive) ||
      (filterType === 'inactive' && !event.isActive) ||
      (filterType === 'high' && event.totalCredits >= 5) ||
      (filterType === 'low' && event.totalCredits < 5);

    return matchesSearch && matchesFilter;
  });

  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.isActive).length;
  const totalStudents = allEvents.length;
  const avgCredits =
    totalStudents > 0
      ? (allEvents.reduce((sum, e) => sum + e.totalCredits, 0) / totalStudents).toFixed(1)
      : 0;

  if (loadingCommission || loadingCredits) {
    return (
      <div className="bg-zinc-50 text-slate-800 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Cargando historial...</p>
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
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            to={`/commission/${id}`}
            className="text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 p-2.5 rounded-xl transition-colors cursor-pointer"
            title="Volver al Panel"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Resumen de Créditos</h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {commission.subject?.name || 'Materia'} / {commission.name}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider">
            {creditValue.toFixed(2)} pts/crédito
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-8 flex flex-col">
        {/* Stats Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grupos</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totalGroups}</p>
            <p className="text-xs text-slate-500 mt-0.5">{activeGroups} activos</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alumnos</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totalStudents}</p>
            <p className="text-xs text-slate-500 mt-0.5">con grupo asignado</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Promedio Créditos</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{avgCredits}</p>
            <p className="text-xs text-slate-500 mt-0.5">por alumno</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor Crédito</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{creditValue.toFixed(2)}</p>
            <p className="text-xs text-slate-500 mt-0.5">puntos</p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar grupo o alumno..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Todos los grupos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="high">≥5 créditos</option>
              <option value="low">{'<'}5 créditos</option>
            </select>

            <button
              onClick={() => {
                setSearch('');
                setFilterType('all');
                setDateFilter('');
              }}
              className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Limpiar
            </button>
          </div>
        </section>

        {/* Groups Table */}
        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-3">Grupo / Alumno</div>
            <div className="col-span-2 text-center">Estado</div>
            <div className="col-span-2 text-right">Créditos</div>
            <div className="col-span-2 text-right">Puntos</div>
            <div className="col-span-3 text-right">Acciones</div>
          </div>

          <div className="flex-col divide-y divide-slate-100 overflow-y-auto">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">
                  {allEvents.length === 0
                    ? 'No hay alumnos con grupo asignado'
                    : 'Sin resultados para los filtros aplicados'}
                </p>
              </div>
            ) : (
              filteredEvents.map((event, index) => {
                const prevEvent = index > 0 ? filteredEvents[index - 1] : null;
                const showGroupHeader = !prevEvent || prevEvent.groupId !== event.groupId;

                return (
                  <div key={event.id}>
                    {showGroupHeader && (
                      <div className="bg-slate-50/50 px-4 sm:px-8 py-3 border-b border-slate-100">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                          {event.group}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 sm:px-8 py-5 items-center hover:bg-slate-50 transition-colors group">
                      <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shadow-sm border border-indigo-200">
                          {event.name
                            .split(' ')
                            .filter((n) => n.length > 0)
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{event.name}</p>
                          <p className="text-xs text-slate-500 md:hidden">{event.group}</p>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                            event.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {event.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex justify-start md:justify-right">
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded-lg ${
                            event.totalCredits >= 5
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-slate-600 bg-slate-50'
                          }`}
                        >
                          {event.totalCredits} cred
                        </span>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex justify-start md:justify-right">
                        <span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg">
                          {event.pointsValue.toFixed(2)} pts
                        </span>
                      </div>

                      <div className="col-span-1 md:col-span-3 flex justify-end">
                        <Link
                          to={`/commission/${id}/groups/${event.groupId}`}
                          className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer opacity-0 group-hover:opacity-100 sm:opacity-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver detalle
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CommissionHistory;
