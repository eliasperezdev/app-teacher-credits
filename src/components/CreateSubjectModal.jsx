import { useState } from 'react';
import { useCreateSubject } from '../hooks/useSubjects';

const CreateSubjectModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const createSubject = useCreateSubject();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!code.trim()) {
      setError('El código es obligatorio');
      return;
    }

    try {
      await createSubject.mutateAsync({ name: name.trim(), code: code.trim() });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la materia');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-black text-slate-800 mb-6">Crear Materia</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Programación I"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Código</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: PROG-1"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors font-mono"
              />
            </div>
            {error && (
              <p className="text-sm font-bold text-coral-600 bg-coral-50 rounded-xl px-4 py-3 text-red-600 bg-red-50">{error}</p>
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
              disabled={createSubject.isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              {createSubject.isPending ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubjectModal;
