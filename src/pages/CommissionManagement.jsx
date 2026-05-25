import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCommission, useUpdateCommission, useDeleteCommission } from '../hooks/useCommissions';
import { useStudents, useImportStudents, useEnrollStudent, useUnenrollStudent } from '../hooks/useStudents';
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

const ConfigTab = ({ commission }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(commission.name);
  const [year, setYear] = useState(commission.year);
  const [period, setPeriod] = useState(commission.period);
  const [minGroupSize, setMinGroupSize] = useState(commission.minGroupSize);
  const [maxGroupSize, setMaxGroupSize] = useState(commission.maxGroupSize);
  const [creditValue, setCreditValue] = useState(commission.creditValue);
  const [autoCompleteGroups, setAutoCompleteGroups] = useState(commission.autoCompleteGroups);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateCommission = useUpdateCommission();
  const deleteCommission = useDeleteCommission();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      await updateCommission.mutateAsync({
        id: commission.id,
        name: name.trim(),
        year: Number(year),
        period: Number(period),
        minGroupSize: Number(minGroupSize),
        maxGroupSize: Number(maxGroupSize),
        creditValue: Number(creditValue),
        autoCompleteGroups,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar la comisión');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCommission.mutateAsync(commission.id);
      navigate('/commissions');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar la comisión');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6">Editar Comisión</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Año</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Período</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(Number(e.target.value))}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors bg-white"
                >
                  <option value={1}>1er Cuatrimestre</option>
                  <option value={2}>2do Cuatrimestre</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Grupo mín.</label>
                <input
                  type="number"
                  value={minGroupSize}
                  onChange={(e) => setMinGroupSize(e.target.value)}
                  min={1}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Grupo máx.</label>
                <input
                  type="number"
                  value={maxGroupSize}
                  onChange={(e) => setMaxGroupSize(e.target.value)}
                  min={1}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Valor de crédito</label>
              <input
                type="number"
                value={creditValue}
                onChange={(e) => setCreditValue(e.target.value)}
                step="0.01"
                min="0"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoCompleteGroups}
                onChange={(e) => setAutoCompleteGroups(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-bold text-slate-700">Auto-completar grupos</span>
            </label>
            {error && (
              <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}
            {updateCommission.isSuccess && (
              <p className="text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3">Comisión actualizada correctamente</p>
            )}
          </div>
          <button
            type="submit"
            disabled={updateCommission.isPending}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
          >
            {updateCommission.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-rose-100">
        <h2 className="text-xl font-black text-rose-600 mb-2">Zona de Peligro</h2>
        <p className="text-sm text-slate-500 mb-4">Esta acción no se puede deshacer. Se eliminarán todos los alumnos, grupos y sesiones asociadas.</p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
          >
            Eliminar Comisión
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={deleteCommission.isPending}
              className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
            >
              {deleteCommission.isPending ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

const StudentsTab = ({ commission, students }) => {
  const [search, setSearch] = useState('');
  const [fileNumber, setFileNumber] = useState('');
  const [enrollError, setEnrollError] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef(null);

  const importStudents = useImportStudents();
  const enrollStudent = useEnrollStudent();
  const unenrollStudent = useUnenrollStudent();

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.lastName.toLowerCase().includes(q) ||
      s.firstName.toLowerCase().includes(q) ||
      s.fileNumber.toLowerCase().includes(q)
    );
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    setImportSuccess('');

    try {
      await importStudents.mutateAsync({ commissionId: commission.id, file });
      setImportSuccess('Importación completada correctamente');
      e.target.value = '';
    } catch (err) {
      setImportError(err.response?.data?.message || 'Error al importar alumnos');
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setEnrollError('');

    if (!fileNumber.trim()) {
      setEnrollError('Ingresa un legajo');
      return;
    }

    try {
      await enrollStudent.mutateAsync({ commissionId: commission.id, fileNumber: fileNumber.trim() });
      setFileNumber('');
    } catch (err) {
      setEnrollError(err.response?.data?.message || 'Error al inscribir alumno');
    }
  };

  const handleUnenroll = async (studentId) => {
    if (!confirm('¿Desinscribir a este alumno?')) return;
    try {
      await unenrollStudent.mutateAsync({ commissionId: commission.id, studentId });
    } catch (err) {
      alert(err.response?.data?.message || 'Error al desinscribir');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Import Section */}
      <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
              <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg">📥</span> Importar desde SIU Guaraní
            </h2>
            <p className="text-sm text-slate-500">Sube el archivo Excel o CSV descargado del SIU. Actualizaremos las inscripciones automáticamente validando por Legajo.</p>
          </div>

          <div className="w-full md:w-[400px]">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl p-6 text-center transition-colors cursor-pointer group"
            >
              <div className="text-indigo-400 group-hover:text-indigo-600 mb-2 transition-colors">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-bold text-indigo-800">Arrastra tu archivo CSV/XLS aquí</p>
              <p className="text-xs text-indigo-500 mt-1">o haz clic para explorar</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {importStudents.isPending && (
              <p className="text-sm text-slate-500 mt-2 text-center">Importando...</p>
            )}
          </div>
        </div>
        {importError && (
          <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-4 py-3 mt-4">{importError}</p>
        )}
        {importSuccess && (
          <p className="text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3 mt-4">{importSuccess}</p>
        )}
      </section>

      {/* Manual Enroll */}
      <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Inscribir Alumno Manualmente</h2>
        <form onSubmit={handleEnroll} className="flex gap-3">
          <input
            type="text"
            value={fileNumber}
            onChange={(e) => setFileNumber(e.target.value)}
            placeholder="Número de legajo"
            className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={enrollStudent.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            {enrollStudent.isPending ? 'Inscribiendo...' : 'Inscribir'}
          </button>
        </form>
        {enrollError && (
          <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-4 py-3 mt-3">{enrollError}</p>
        )}
      </section>

      {/* Student List */}
      <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            Alumnos Inscriptos <span className="text-slate-400 font-medium text-sm ml-2">({students.length})</span>
          </h2>
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por apellido o legajo..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Table Headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-3 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-4">Alumno</div>
          <div className="col-span-2">Legajo</div>
          <div className="col-span-2">Grupo</div>
          <div className="col-span-2 text-center">Acciones</div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            {students.length === 0 ? 'No hay alumnos inscriptos' : 'Sin resultados'}
          </p>
        ) : (
          <div className="flex flex-col gap-2 mt-3">
            {filtered.map((s) => (
              <div key={s.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white hover:bg-slate-50 border border-transparent hover:border-slate-100 p-4 rounded-2xl transition-colors group">
                <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {s.firstName[0]}{s.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{s.lastName}, {s.firstName}</p>
                    <p className="text-xs text-slate-500 md:hidden mt-0.5">Leg: {s.fileNumber}</p>
                  </div>
                </div>
                <div className="hidden md:block col-span-2 text-sm text-slate-600 font-medium">{s.fileNumber}</div>
                <div className="hidden md:block col-span-2">
                  {s.group ? (
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">{s.group.name}</span>
                  ) : (
                    <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2 py-1 rounded-md border border-rose-100">Sin grupo</span>
                  )}
                </div>
                <div className="col-span-1 md:col-span-2 flex justify-end md:justify-center">
                  <button
                    onClick={() => handleUnenroll(s.id)}
                    className="bg-white border-2 border-slate-100 hover:border-rose-300 text-slate-500 hover:text-rose-600 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Desinscribir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

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
