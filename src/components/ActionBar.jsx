import { useState } from 'react';

const ActionBar = ({ onCreateSubject, onCreateCommission }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h2 className="text-3xl font-black text-slate-800">Mis Comisiones</h2>
        <p className="text-slate-500 font-medium mt-1">1er Cuatrimestre 2026</p>
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <button
          onClick={onCreateSubject}
          className="flex-1 sm:flex-none bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-bold py-3 px-5 rounded-2xl transition-all cursor-pointer"
        >
          Crear Materia
        </button>
        <button
          onClick={onCreateCommission}
          className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="text-xl leading-none">+</span> Nueva Comisión
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
