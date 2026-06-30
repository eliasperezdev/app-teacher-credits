import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicGroups } from '../hooks/usePublic';

const GroupItem = ({ group }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-sm">
            {group.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{group.name}</h3>
            <p className="text-xs text-slate-500">{group.memberCount} integrantes</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-sm font-bold text-indigo-600">{group.totalCredits} créditos</span>
            {group.pointsValue > 0 && (
              <span className="text-xs text-slate-400 ml-2">({group.pointsValue.toFixed(2)} pts)</span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
          <div className="hidden sm:grid grid-cols-12 gap-4 pb-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Alumno</div>
            <div className="col-span-2 text-right">Créditos</div>
            <div className="col-span-2 text-right">Calculados</div>
            <div className="col-span-2 text-right">Canjeados</div>
            <div className="col-span-2 text-right">Disponibles</div>
          </div>
          <div className="space-y-1">
            {group.members.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center py-2 px-3 rounded-xl"
              >
                <div className="sm:col-span-4 flex items-center gap-3">
                  <div className="w-7 h-7 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{member.lastName}, {member.firstName}</span>
                </div>
                <div className="sm:col-span-2 text-right">
                  <span className="text-sm font-bold text-emerald-600">{member.totalCredits}</span>
                </div>
                <div className="sm:col-span-2 text-right">
                  <span className="text-sm text-slate-600">
                    {member.pointsValue > 0 ? member.pointsValue.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="sm:col-span-2 text-right">
                  <span className="text-sm text-amber-600">
                    {member.totalRedeemed > 0 ? member.totalRedeemed.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="sm:col-span-2 text-right">
                  <span className="text-sm font-bold text-indigo-600">
                    {member.availablePoints > 0 ? member.availablePoints.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PublicRanking = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = usePublicGroups(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-slate-600 font-bold text-lg mb-2">Link no válido o expirado</p>
          <p className="text-slate-400 text-sm">Este enlace puede haber sido revocado por el docente.</p>
        </div>
      </div>
    );
  }

  const { commission, groups } = data?.data || {};

  if (!commission) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-slate-400">Datos no disponibles</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-6 shadow-sm">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Grupos</h1>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 ml-14">
            <span className="font-bold text-slate-700">{commission.subject?.name}</span>
            <span className="text-slate-300">|</span>
            <span>{commission.name}</span>
            <span className="text-slate-300">|</span>
            <span>{commission.year} - {commission.period === 1 ? '1er' : '2do'} Cuatrimestre</span>
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto p-4 sm:p-8">
        {groups.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No hay grupos activos</p>
          </div>
        ) : (
          <div className="space-y-2">
            {groups.map((group) => (
              <GroupItem key={group.id} group={group} />
            ))}
          </div>
        )}

        <div className="text-center mt-12 mb-6">
          <p className="text-xs text-slate-400">
            Valor por crédito: <span className="font-bold">{commission.creditValue?.toFixed(2) || '0.00'} pts</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default PublicRanking;
