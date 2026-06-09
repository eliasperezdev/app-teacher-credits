import { useState } from 'react';
import { useUpdateStudent } from '../hooks/useStudents';

const EditStudentModal = ({ student, onClose }) => {
  const [firstName, setFirstName] = useState(student.firstName);
  const [lastName, setLastName] = useState(student.lastName);
  const [fileNumber, setFileNumber] = useState(student.fileNumber);
  const [error, setError] = useState('');
  const updateStudent = useUpdateStudent();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {};
    if (firstName.trim() && firstName.trim() !== student.firstName) payload.firstName = firstName.trim();
    if (lastName.trim() && lastName.trim() !== student.lastName) payload.lastName = lastName.trim();
    if (fileNumber.trim() && fileNumber.trim() !== student.fileNumber) payload.fileNumber = fileNumber.trim();

    if (Object.keys(payload).length === 0) {
      setError('No se realizaron cambios');
      return;
    }

    try {
      await updateStudent.mutateAsync({ studentId: student.id, ...payload });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el alumno');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-black text-slate-800 mb-6">Modificar Datos del Alumno</h3>
        <p className="text-sm text-slate-500 mb-6">
          Editando: <span className="font-bold">{student.lastName}, {student.firstName}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Apellido</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Legajo</label>
              <input
                type="text"
                value={fileNumber}
                onChange={(e) => setFileNumber(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-4 py-3 mt-4">{error}</p>
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
              disabled={updateStudent.isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              {updateStudent.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
