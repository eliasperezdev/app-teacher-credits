import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCommission, useUpdateCommission, useDeleteCommission } from '../hooks/useCommissions';
import { useStudents, useImportStudents, useEnrollStudent, useUnenrollStudent } from '../hooks/useStudents';
import { useGroups, useCreateGroup, useAddGroupMember, useRemoveGroupMember, useDeleteGroup, useUpdateGroup } from '../hooks/useGroups';
import { useCreditSummary, useCreateCredit } from '../hooks/useCredits';
import Header from '../components/Header';

const TABS = [
  { id: 'config', label: '⚙️ Configuración' },
  { id: 'students', label: '👥 Alumnos e Importación' },
  { id: 'groups', label: '🃏 Gestión de Grupos' },
];

const CommissionManagement = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'groups');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const { data: commissionData, isLoading: loadingCommission } = useCommission(id);
  const { data: studentsData } = useStudents(id);
  const { data: groupsData } = useGroups(id);
  const { data: creditSummaryData } = useCreditSummary(id);

  const commission = commissionData?.data;
  const students = studentsData?.data ?? [];
  const groups = groupsData?.data ?? [];
  const creditSummary = creditSummaryData?.data;

  const studentCreditMap = {};
  if (creditSummary?.groups) {
    for (const group of creditSummary.groups) {
      for (const member of group.members) {
        studentCreditMap[member.id] = {
          totalCredits: member.totalCredits,
          pointsValue: member.pointsValue,
          creditValue: creditSummary.creditValue,
        };
      }
    }
  }

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
        {activeTab === 'students' && <StudentsTab commission={commission} students={students} studentCreditMap={studentCreditMap} />}
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

const StudentsTab = ({ commission, students, studentCreditMap }) => {
  const [search, setSearch] = useState('');
  const [fileNumber, setFileNumber] = useState('');
  const [enrollError, setEnrollError] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [canjearModal, setCanjearModal] = useState(null);
  const [canjearError, setCanjearError] = useState('');
  const [canjearSuccess, setCanjearSuccess] = useState('');
  const fileInputRef = useRef(null);

  const importStudents = useImportStudents();
  const enrollStudent = useEnrollStudent();
  const unenrollStudent = useUnenrollStudent();
  const createCredit = useCreateCredit();

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

  const handleCanjear = async () => {
    if (!canjearModal) return;
    setCanjearError('');
    setCanjearSuccess('');

    try {
      await createCredit.mutateAsync({
        groupId: canjearModal.student.group.id,
        amount: -canjearModal.credits,
        reason: 'Canje de créditos',
      });
      setCanjearSuccess('Créditos canjeados correctamente');
      setCanjearModal(null);
      setTimeout(() => setCanjearSuccess(''), 3000);
    } catch (err) {
      setCanjearError(err.response?.data?.message || 'Error al canjear créditos');
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
          <div className="col-span-3">Alumno</div>
          <div className="col-span-2">Legajo</div>
          <div className="col-span-2">Grupo</div>
          <div className="col-span-2 text-right">Créditos</div>
          <div className="col-span-3 text-center">Acciones</div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            {students.length === 0 ? 'No hay alumnos inscriptos' : 'Sin resultados'}
          </p>
        ) : (
          <div className="flex flex-col gap-2 mt-3">
            {filtered.map((s) => {
              const creditInfo = studentCreditMap[s.id];
              const totalCredits = creditInfo?.totalCredits ?? 0;
              const pointsValue = creditInfo?.pointsValue ?? 0;
              const canCanjear = totalCredits >= 5;

              return (
                <div key={s.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white hover:bg-slate-50 border border-transparent hover:border-slate-100 p-4 rounded-2xl transition-colors group">
                  <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{s.lastName}, {s.firstName}</p>
                      <p className="text-xs text-slate-500 md:hidden mt-0.5">Leg: {s.fileNumber}{s.group ? ` • G: ${s.group.name}` : ''}</p>
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
                  <div className="col-span-1 md:col-span-2 flex items-center md:justify-end gap-2">
                    <div className={`px-3 py-1.5 rounded-lg text-right w-fit md:w-full ${
                      totalCredits >= 5
                        ? 'bg-emerald-50 border border-emerald-100'
                        : 'bg-slate-50 border border-slate-100'
                    }`}>
                      <span className={`text-sm font-bold ${
                        totalCredits >= 5 ? 'text-emerald-700' : 'text-slate-600'
                      }`}>
                        {totalCredits} <span className="text-[10px] uppercase font-bold text-slate-400">Cred</span>
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-3 flex justify-end md:justify-center gap-2">
                    <button
                      onClick={() => handleUnenroll(s.id)}
                      className="bg-white border-2 border-slate-100 hover:border-rose-300 text-slate-500 hover:text-rose-600 font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Desinscribir
                    </button>
                    <button
                      onClick={() => canCanjear && setCanjearModal({ student: s, credits: totalCredits, points: pointsValue })}
                      disabled={!canCanjear}
                      className={`font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                        canCanjear
                          ? 'bg-amber-100 hover:bg-amber-400 text-amber-700 hover:text-amber-900'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'
                      }`}
                      title={!canCanjear ? 'Necesita al menos 5 créditos' : 'Canjear créditos'}
                    >
                      <span>🎁</span> Canjear
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {canjearModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Canjear Créditos</h3>
            <p className="text-sm text-slate-500 mb-6">
              <span className="font-bold">{canjearModal.student.lastName}, {canjearModal.student.firstName}</span> tiene{' '}
              <span className="font-bold text-emerald-600">{canjearModal.credits} créditos</span>
              {canjearModal.points > 0 && (
                <span> ({canjearModal.points.toFixed(2)} pts)</span>
              )}
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-amber-700">
                Esta acción restará todos los créditos del alumno. ¿Confirmar canje?
              </p>
            </div>

            {canjearError && (
              <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-4">{canjearError}</p>
            )}
            {canjearSuccess && (
              <p className="text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3 mb-4">{canjearSuccess}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setCanjearModal(null); setCanjearError(''); }}
                className="flex-1 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCanjear}
                disabled={createCredit.isPending}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
              >
                {createCredit.isPending ? 'Canjeando...' : 'Confirmar Canje'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GroupsTab = ({ commission, students, groups }) => {
  const [selectedGroupId, setSelectedGroupId] = useState(groups.length > 0 ? groups[0].id : null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || null;

  return (
    <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
      {/* Left Column: Group Directory */}
      <aside className="w-full xl:w-[380px] flex flex-col gap-4 flex-shrink-0">
        <button
          onClick={() => setShowCreateGroup(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="text-xl leading-none">+</span> Crear Nuevo Grupo
        </button>

        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Directorio ({groups.length})</h2>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
            {groups.map((g) => (
              <GroupDirectoryItem
                key={g.id}
                group={g}
                minSize={commission.minGroupSize}
                isSelected={g.id === selectedGroupId}
                onSelect={() => setSelectedGroupId(g.id)}
              />
            ))}
            {groups.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No hay grupos creados</p>
            )}
          </div>
        </div>
      </aside>

      {/* Right Column: Group Editor */}
      <section className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden relative min-h-0">
        {selectedGroup ? (
          <GroupEditor group={selectedGroup} students={students} maxSize={commission.maxGroupSize} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 z-10">
            <span className="text-4xl mb-4">🃏</span>
            <p className="text-slate-500 font-medium">Selecciona un grupo a la izquierda o crea uno nuevo</p>
          </div>
        )}
      </section>

      {showCreateGroup && (
        <CreateGroupModal
          commissionId={commission.id}
          onClose={() => setShowCreateGroup(false)}
          onCreated={(newGroup) => setSelectedGroupId(newGroup.id)}
        />
      )}
    </div>
  );
};

const GroupDirectoryItem = ({ group, minSize, isSelected, onSelect }) => {
  const deleteGroup = useDeleteGroup();
  const isComplete = group.members.length >= minSize;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar el grupo "${group.name}"?`)) return;
    try {
      await deleteGroup.mutateAsync(group.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar el grupo');
    }
  };

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={`text-left rounded-xl p-3 cursor-pointer transition-colors relative group ${
        isSelected
          ? 'bg-indigo-50 border-2 border-indigo-600'
          : isComplete
            ? 'bg-white border-2 border-slate-100 hover:border-slate-300'
            : 'bg-rose-50 border-2 border-rose-100 hover:border-rose-300'
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
          isSelected
            ? 'text-indigo-600 bg-indigo-100'
            : isComplete
              ? 'text-slate-500 bg-slate-100 group-hover:bg-slate-200'
              : 'text-rose-600 bg-rose-100'
        }`}>
          {group.name.substring(0, 6).toUpperCase()}
        </span>
        <span className={`text-xs font-bold ${
          isSelected ? 'text-indigo-700' : isComplete ? 'text-slate-500' : 'text-rose-600'
        }`}>
          {isComplete ? `${group.members.length} Alumnos` : `⚠️ ${group.members.length} Alumno${group.members.length !== 1 ? 's' : ''}`}
        </span>
      </div>
      <h3 className={`text-base font-bold truncate pr-6 ${
        isSelected ? 'text-slate-900' : isComplete ? 'text-slate-700' : 'text-rose-900'
      }`}>
        {group.name}
      </h3>
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
        title="Eliminar grupo"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

const GroupEditor = ({ group, students, maxSize }) => {
  const [name, setName] = useState(group.name);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateGroup = useUpdateGroup();
  const addMember = useAddGroupMember();
  const removeMember = useRemoveGroupMember();

  const isComplete = group.members.length >= maxSize;

  const sortedStudents = [...students].sort((a, b) => {
    const aHasGroup = !!a.group;
    const bHasGroup = !!b.group;
    if (!aHasGroup && bHasGroup) return -1;
    if (aHasGroup && !bHasGroup) return 1;
    return a.lastName.localeCompare(b.lastName);
  });

  const filteredStudents = search.length > 0
    ? sortedStudents.filter((s) => {
        const q = search.toLowerCase();
        return (
          s.lastName.toLowerCase().includes(q) ||
          s.firstName.toLowerCase().includes(q) ||
          s.fileNumber.toLowerCase().includes(q)
        );
      })
    : sortedStudents;

  const handleSaveName = async () => {
    if (!name.trim()) return;
    try {
      await updateGroup.mutateAsync({ id: group.id, name: name.trim() });
      setSuccess('Nombre actualizado');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar');
    }
  };

  const handleAddMember = async (studentId) => {
    try {
      await addMember.mutateAsync({ groupId: group.id, studentId });
      setSearch('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al agregar integrante');
    }
  };

  const handleRemoveMember = async (studentId) => {
    try {
      await removeMember.mutateAsync({ groupId: group.id, studentId });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al quitar integrante');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-200">
            Grupo
          </span>
          {isComplete ? (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg> Completo
            </span>
          ) : (
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-md">
              ⚠️ Incompleto
            </span>
          )}
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSaveName}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
          placeholder="Escribe el nombre del grupo..."
          className="w-full text-3xl sm:text-4xl font-black text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-slate-300 transition-colors hover:text-indigo-900 focus:text-indigo-700"
        />
        {success && <p className="text-xs text-emerald-600 font-bold mt-1">{success}</p>}
        {error && <p className="text-xs text-red-600 font-bold mt-1">{error}</p>}
      </div>

      {/* Two-column editor */}
      <div className="flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden">
        {/* Left: Search & Add */}
        <div className="w-full xl:w-1/2 p-6 sm:p-8 border-b xl:border-b-0 xl:border-r border-slate-100 flex flex-col gap-4 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>🔍</span> Buscar y Agregar Alumno
          </h3>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nombre o Legajo..."
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium shadow-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 mt-2 space-y-2">
            {search.length > 0 && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Resultados para "{search}"
              </p>
            )}
            {search.length === 0 && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Todos los alumnos
              </p>
            )}
            {filteredStudents.length === 0 ? (
              <p className="text-sm text-slate-400">Sin resultados</p>
            ) : (
              filteredStudents.map((s) => {
                const alreadyInGroup = group.members.some((m) => m.id === s.id);
                const hasOtherGroup = s.group && !alreadyInGroup;

                return (
                  <div key={s.id} className={`flex items-center justify-between p-3 border rounded-xl transition-colors ${
                    alreadyInGroup || hasOtherGroup ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{s.lastName}, {s.firstName}</p>
                      <p className="text-xs text-slate-500">
                        {s.fileNumber} ·{' '}
                        {alreadyInGroup ? (
                          <span className="text-indigo-500 font-medium">Ya en este grupo</span>
                        ) : hasOtherGroup ? (
                          <span className="text-amber-500 font-medium">En {s.group.name}</span>
                        ) : (
                          <span className="text-rose-500 font-medium">Sin grupo</span>
                        )}
                      </p>
                    </div>
                    {alreadyInGroup ? (
                      <button className="bg-slate-200 text-slate-500 font-bold py-1.5 px-3 rounded-lg text-xs cursor-not-allowed">
                        Agregado
                      </button>
                    ) : hasOtherGroup ? (
                      <button className="bg-slate-200 text-slate-500 font-bold py-1.5 px-3 rounded-lg text-xs cursor-not-allowed">
                        Asignado
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddMember(s.id)}
                        className="bg-indigo-100 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        + Agregar
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Current Members */}
        <div className="w-full xl:w-1/2 p-6 sm:p-8 bg-slate-50/30 flex flex-col gap-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>👥</span> Integrantes Actuales
            </h3>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">
              {group.members.length}/{maxSize} max
            </span>
          </div>

          <ul className="space-y-3 flex-1 overflow-y-auto">
            {group.members.map((m) => (
              <li key={m.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm group">
                <div>
                  <p className="text-sm font-bold text-slate-800">{m.lastName}, {m.firstName}</p>
                  <p className="text-xs text-slate-500">{m.fileNumber}</p>
                </div>
                <button
                  onClick={() => handleRemoveMember(m.id)}
                  className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer"
                  title="Quitar del grupo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
            {group.members.length === 0 && (
              <li className="text-center py-8 text-slate-400 text-sm">
                No hay integrantes en este grupo
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

const CreateGroupModal = ({ commissionId, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const createGroup = useCreateGroup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      const result = await createGroup.mutateAsync({ commissionId, name: name.trim() });
      onCreated?.(result.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el grupo');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-black text-slate-800 mb-6">Nuevo Grupo</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Los Capos"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-4 py-3 mt-3">{error}</p>
          )}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createGroup.isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              {createGroup.isPending ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionManagement;
