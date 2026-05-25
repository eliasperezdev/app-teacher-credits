import { useParams, Link } from 'react-router-dom';
import { useCommission } from '../hooks/useCommissions';
import Header from '../components/Header';

const CommissionDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useCommission(id);
  const commission = data?.data;

  if (isLoading) {
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
      <Header />
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-8">
        <div className="mb-8">
          <Link to="/commissions" className="text-indigo-600 font-bold text-sm">
            ← Volver a Comisiones
          </Link>
          <h2 className="text-3xl font-black text-slate-800 mt-2">{commission.name}</h2>
          <p className="text-slate-500 font-medium">
            {commission.subject?.name} — {commission.year}, Período {commission.period}
          </p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <p className="text-slate-500">Consola de clase — Próximamente</p>
        </div>
      </main>
    </div>
  );
};

export default CommissionDetail;
