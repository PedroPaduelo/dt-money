import React, { useState, useEffect } from 'react';

// SVG inline para ArrowUpCircle (entradas)
const ArrowUpCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="m16 12-4-4-4 4M12 8V16"/>
  </svg>
);

// SVG inline para ArrowDownCircle (saídas)
const ArrowDownCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="m8 12 4 4 4-4M12 16V8"/>
  </svg>
);

// SVG inline para DollarSign (total)
const DollarSignIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const Summary = () => {
  const [summary, setSummary] = useState({
    income: 0,
    outcome: 0,
    total: 0,
  });

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const request = indexedDB.open('dtmoney', 1);

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['transactions'], 'readonly');
          const store = transaction.objectStore('transactions');
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = () => {
            const transactions = getAllRequest.result;
            const income = transactions
              .filter((t: any) => t.type === 'income')
              .reduce((sum: number, t: any) => sum + t.amount, 0);
            const outcome = transactions
              .filter((t: any) => t.type === 'outcome')
              .reduce((sum: number, t: any) => sum + t.amount, 0);

            setSummary({
              income,
              outcome,
              total: income - outcome,
            });
          };
        };
      } catch (error) {
        console.error('Error loading summary:', error);
      }
    };

    loadSummary();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card de Entradas */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
          <header className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-green-400">
                <ArrowUpCircleIcon />
              </div>
              <span className="text-gray-300 text-sm sm:text-base">Entradas</span>
            </div>
          </header>
          <div className="mt-4">
            <strong className="text-2xl sm:text-3xl text-white block">
              {formatCurrency(summary.income)}
            </strong>
          </div>
        </div>

        {/* Card de Saídas */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
          <header className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-red-400">
                <ArrowDownCircleIcon />
              </div>
              <span className="text-gray-300 text-sm sm:text-base">Saídas</span>
            </div>
          </header>
          <div className="mt-4">
            <strong className="text-2xl sm:text-3xl text-white block">
              {formatCurrency(summary.outcome)}
            </strong>
          </div>
        </div>

        {/* Card de Total */}
        <div className={`rounded-lg p-4 sm:p-6 border ${
          summary.total >= 0 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-red-900 border-red-800'
        }`}>
          <header className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={summary.total >= 0 ? 'text-green-400' : 'text-red-400'}>
                <DollarSignIcon />
              </div>
              <span className="text-gray-300 text-sm sm:text-base">Total</span>
            </div>
          </header>
          <div className="mt-4">
            <strong className={`text-2xl sm:text-3xl block ${
              summary.total >= 0 ? 'text-white' : 'text-red-400'
            }`}>
              {formatCurrency(summary.total)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;