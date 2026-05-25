import { Link } from 'react-router-dom';

const CommissionCard = ({ commission, subjectName }) => {
  const studentCount = commission._count?.commissionStudents ?? 0;
  const groupCount = commission._count?.groups ?? 0;
  const hasStudents = studentCount > 0;

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
          {subjectName || 'Sin materia'}
        </span>
        {hasStudents ? (
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1.5 rounded-lg flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Activa
          </span>
        ) : (
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1.5 rounded-lg">
            Borrador
          </span>
        )}
      </div>

      <h3 className="text-2xl font-black text-slate-800 mb-1">{commission.name}</h3>
      <p className="text-sm text-slate-500 font-medium mb-6">
        {commission.year} — Período {commission.period}
      </p>

      {!hasStudents ? (
        <div className="grid grid-cols-2 gap-3 mb-8 bg-rose-50 rounded-2xl p-4 border border-rose-100">
          <div className="col-span-2 flex items-center gap-2">
            <span className="text-rose-500">⚠️</span>
            <span className="text-sm font-bold text-rose-700">Falta importar alumnos</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-8 bg-slate-50 rounded-2xl p-4">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Alumnos</span>
            <span className="text-xl font-black text-slate-700">{studentCount}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Grupos</span>
            <span className="text-xl font-black text-slate-700">{groupCount}</span>
          </div>
        </div>
      )}

      <div className="mt-auto grid grid-cols-2 gap-3">
        <Link
          to={`/commission/${commission.id}`}
          className="col-span-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer text-sm text-center"
        >
          ▶️ Abrir Consola de Clase
        </Link>
        <button className="bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-600 font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
          ⚙️ Configurar
        </button>
        <Link
          to={`/commission/${commission.id}/students`}
          className="bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-600 font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-sm text-center"
        >
          👥 Alumnos
        </Link>
        {hasStudents && (
          <Link
            to={`/commission/${commission.id}/credits`}
            className="col-span-2 bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-600 font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-sm text-center"
          >
            📊 Ver Créditos
          </Link>
        )}
      </div>
    </div>
  );
};

export default CommissionCard;
