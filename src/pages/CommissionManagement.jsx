import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCommission } from '../hooks/useCommissions';
import { useStudents } from '../hooks/useStudents';
import { useGroups } from '../hooks/useGroups';
import Header from '../components/Header';

const TABS = [
  { id: 'config', label: '⚙️ Configuración' },
  { id: 'students', label: '👥 Alumnos e Importación' },
  { id: 'groups', label: '🃏 Gestión de Grupos' },
];

const CommissionManagement = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('config');

  const { data: commissionData, isLoading: loadingCommission } = useCommission(id);
  const { data: studentsData } = useStudents(id);
  const { data: groupsData } = useGroups(id);

  const commission = commissionData?.data;
  const students = studentsData?.data ?? [];
  const groups = groupsData?.data ?? [];

  const irregularCount = groups.filter((g) =>
    g.members.length < (commission?.minGroupSize ?? 3)
  ).length;

  if (loadingCommission) {
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
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
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
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            {commission.subject?.name || 'Materia'} <span className="text-slate-400 font-medium mx-1">/</span> {commission.name}
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-8">
        <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-bold text-sm uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {tab.id === 'groups' && irregularCount > 0 && (
                <span className="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded-md">
                  {irregularCount} Incompleto
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'config' && <ConfigTab commission={commission} />}
        {activeTab === 'students' && <StudentsTab commission={commission} students={students} />}
        {activeTab === 'groups' && <GroupsTab commission={commission} students={students} groups={groups} />}
      </main>
    </div>
  );
};

const ConfigTab = ({ commission }) => (
  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
    <h2 className="text-2xl font-black text-slate-800 mb-4">Configuración</h2>
    <p className="text-slate-500">Formulario de edición — Fase 2</p>
    <div className="mt-4 space-y-2 text-sm text-slate-600">
      <p><strong>Nombre:</strong> {commission.name}</p>
      <p><strong>Año:</strong> {commission.year}</p>
      <p><strong>Período:</strong> {commission.period}</p>
      <p><strong>Grupo mín.:</strong> {commission.minGroupSize}</p>
      <p><strong>Grupo máx.:</strong> {commission.maxGroupSize}</p>
      <p><strong>Valor crédito:</strong> {commission.creditValue}</p>
      <p><strong>Auto-completar:</strong> {commission.autoCompleteGroups ? 'Sí' : 'No'}</p>
    </div>
  </div>
);

const StudentsTab = ({ commission, students }) => (
  <div className="flex flex-col gap-8">
    <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
      <h2 className="text-lg font-bold text-slate-800 mb-2">📥 Importar desde SIU Guaraní</h2>
      <p className="text-sm text-slate-500 mb-4">Sube el archivo Excel o CSV descargado del SIU.</p>
      <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl p-6 text-center transition-colors cursor-pointer">
        <p className="text-sm font-bold text-indigo-800">Arrastra tu archivo CSV/XLS aquí</p>
        <p className="text-xs text-indigo-500 mt-1">o haz clic para explorar</p>
      </div>
    </section>

    <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Alumnos Inscriptos <span className="text-slate-400 font-medium text-sm ml-2">({students.length})</span>
      </h2>
      {students.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No hay alumnos inscriptos</p>
      ) : (
        <div className="space-y-2">
          {students.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                {s.firstName[0]}{s.lastName[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{s.lastName}, {s.firstName}</p>
                <p className="text-xs text-slate-500">Leg: {s.fileNumber}</p>
              </div>
              {s.group ? (
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">{s.group.name}</span>
              ) : (
                <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2 py-1 rounded-md border border-rose-100">Sin grupo</span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  </div>
);

const GroupsTab = ({ commission, students, groups }) => {
  const unassigned = students.filter((s) => !s.group);

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <aside className="w-full xl:w-96">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <span className="text-rose-500">⚠️</span> Sin Asignar
            </h2>
            <span className="bg-rose-50 text-rose-600 font-bold px-2 py-1 rounded-lg text-sm">{unassigned.length} Alumnos</span>
          </div>
          {unassigned.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Todos los alumnos tienen grupo</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {unassigned.map((s) => (
                <div key={s.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{s.lastName}, {s.firstName}</p>
                      <p className="text-[11px] font-medium text-slate-500">{s.fileNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <section className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-slate-800">Grupos Activos</h2>
          <span className="bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded-lg text-sm border border-slate-200">{groups.length} Grupos</span>
        </div>
        {groups.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No hay grupos creados</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((g) => (
              <GroupCard key={g.id} group={g} minSize={commission.minGroupSize} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const GroupCard = ({ group, minSize }) => {
  const isComplete = group.members.length >= minSize;

  return (
    <div className={`bg-white rounded-3xl p-5 shadow-sm flex flex-col ${
      isComplete ? 'border-2 border-slate-100 hover:border-indigo-200 transition-colors' : 'border-2 border-rose-200 shadow-md relative overflow-hidden'
    }`}>
      {!isComplete && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
      )}
      <div className="flex justify-between items-start mb-4 relative">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mt-2 leading-tight">{group.name}</h3>
        </div>
        {isComplete ? (
          <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-1.5 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        ) : (
          <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1.5 rounded-lg flex items-center gap-1">
            ⚠️ Incompleto
          </span>
        )}
      </div>

      <ul className="space-y-2 mb-6 flex-1 relative">
        {group.members.map((m) => (
          <li key={m.id} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg group">
            <span className="text-sm font-medium text-slate-700">{m.lastName}, {m.firstName}</span>
            <button className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
        {!isComplete && (
          <li className="flex items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/50 px-3 py-2 rounded-lg text-xs font-medium text-slate-400">
            Falta {minSize - group.members.length} integrante (mínimo)
          </li>
        )}
      </ul>

      <div className={`pt-4 border-t ${isComplete ? 'border-slate-100' : 'border-rose-100'} relative`}>
        <button className={`w-full text-center text-sm font-bold py-2 rounded-xl transition-colors cursor-pointer ${
          isComplete
            ? 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-dashed border-indigo-200'
            : 'text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-200'
        }`}>
          {isComplete ? '+ Añadir integrante' : 'Asignar alumno aquí'}
        </button>
      </div>
    </div>
  );
};

export default CommissionManagement;
