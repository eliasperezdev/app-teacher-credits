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
        <Link
          to={`/commission/${commission.id}`}
          className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
          title="Gestionar comisión"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
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
          to={`/commission/${commission.id}/class`}
          className="col-span-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer text-sm text-center"
        >
          ▶️ Abrir Consola de Clase
        </Link>
        <Link
          to={`/commission/${commission.id}`}
          className="bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-600 font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-sm text-center"
        >
          ⚙️ Gestionar
        </Link>
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
