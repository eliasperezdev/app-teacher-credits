import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubjects } from '../hooks/useSubjects';
import { useCommissions } from '../hooks/useCommissions';
import Header from '../components/Header';
import ActionBar from '../components/ActionBar';
import CommissionCard from '../components/CommissionCard';
import CreateSubjectModal from '../components/CreateSubjectModal';
import CreateCommissionModal from '../components/CreateCommissionModal';

const CommissionDashboard = () => {
  const { user } = useAuth();
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);

  const { data: subjectsData, isLoading: loadingSubjects } = useSubjects();
  const subjects = subjectsData?.data ?? [];

  return (
    <div className="bg-zinc-50 text-slate-800 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-8">
        <ActionBar
          onCreateSubject={() => setShowSubjectModal(true)}
          onCreateCommission={() => setShowCommissionModal(true)}
        />

        {loadingSubjects ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Cargando comisiones...</p>
            </div>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg font-medium mb-4">No tienes materias creadas</p>
            <button
              onClick={() => setShowSubjectModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all cursor-pointer"
            >
              Crear tu primera materia
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCommissions key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </main>

      {showSubjectModal && (
        <CreateSubjectModal onClose={() => setShowSubjectModal(false)} />
      )}

      {showCommissionModal && (
        <CreateCommissionModal onClose={() => setShowCommissionModal(false)} />
      )}
    </div>
  );
};

const SubjectCommissions = ({ subject }) => {
  const { data: commissionsData, isLoading } = useCommissions(subject.id);
  const commissions = commissionsData?.data ?? [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-6 bg-slate-100 rounded-lg w-24 mb-4"></div>
        <div className="h-8 bg-slate-100 rounded-lg w-32 mb-2"></div>
        <div className="h-4 bg-slate-100 rounded-lg w-48 mb-6"></div>
        <div className="h-20 bg-slate-100 rounded-2xl mb-8"></div>
        <div className="h-10 bg-slate-100 rounded-xl mb-3"></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-slate-100 rounded-xl"></div>
          <div className="h-10 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (commissions.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 border-dashed flex flex-col items-center justify-center min-h-[280px]">
        <span className="text-4xl mb-3">📋</span>
        <p className="text-slate-500 font-medium text-center">{subject.name}</p>
        <p className="text-slate-400 text-sm">Sin comisiones</p>
      </div>
    );
  }

  return commissions.map((commission) => (
    <CommissionCard
      key={commission.id}
      commission={commission}
      subjectName={subject.name}
    />
  ));
};

export default CommissionDashboard;
