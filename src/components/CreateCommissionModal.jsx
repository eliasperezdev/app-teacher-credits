import { useState } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { useCreateCommission } from '../hooks/useCommissions';

const CreateCommissionModal = ({ onClose }) => {
  const [subjectId, setSubjectId] = useState('');
  const [name, setName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState(1);
  const [minGroupSize, setMinGroupSize] = useState(3);
  const [maxGroupSize, setMaxGroupSize] = useState(5);
  const [creditValue, setCreditValue] = useState(0.05);
  const [autoCompleteGroups, setAutoCompleteGroups] = useState(true);
  const [error, setError] = useState('');

  const { data: subjectsData } = useSubjects();
  const subjects = subjectsData?.data ?? [];
  const createCommission = useCreateCommission();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!subjectId) {
      setError('Selecciona una materia');
      return;
    }
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      await createCommission.mutateAsync({
        subjectId,
        name: name.trim(),
        year: Number(year),
        period: Number(period),
        minGroupSize: Number(minGroupSize),
        maxGroupSize: Number(maxGroupSize),
        creditValue: Number(creditValue),
        autoCompleteGroups,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la comisión');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-black text-slate-800 mb-6">Nueva Comisión</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Materia</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors bg-white"
                autoFocus
              >
                <option value="">Seleccionar materia...</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Comisión A, Lunes mañana"
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
          </div>
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
              disabled={createCommission.isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              {createCommission.isPending ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommissionModal;
