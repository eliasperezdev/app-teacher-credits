import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const CommissionContent = () => {
  const { user } = useAuth();

  return (
    <div className="bg-zinc-50 text-slate-800 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-8">
        <p>Bienvenido, {user?.name || 'Profesor'}</p>
      </main>
    </div>
  );
};

const CommissionDashboard = () => <CommissionContent />;

export default CommissionDashboard;
