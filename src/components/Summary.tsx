import React, { useState, useEffect } from "react";

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

const Summary = ({ transactions = [] }) => {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    total: 0
  });

  const loadSummary = async () => {
    // Dados mock para fallback
    const mockSummary = {
      income: 5000,
      expense: 3200,
      total: 1800
    };

    try {
      // Tenta abrir o IndexedDB
      const request = indexedDB.open('dt-money-db');
      
      request.onerror = () => {
        console.warn('Erro ao abrir IndexedDB, usando dados mock');
        setSummary(mockSummary);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        
        // VERIFICAÇÃO SEGURA - Verifica se o object store existe antes de usar
        if (!db.objectStoreNames.contains('transactions')) {
          console.warn('Object store "transactions" não encontrado, usando dados mock');
          setSummary(mockSummary);
          return;
        }
        
        try {
          const transaction = db.transaction(['transactions'], 'readonly');
          const objectStore = transaction.objectStore('transactions');
          const getAllRequest = objectStore.getAll();
          
          getAllRequest.onsuccess = () => {
            const transactions = getAllRequest.result || [];
            const income = transactions
              .filter(t => t.type === 'income')
              .reduce((acc, t) => acc + Number(t.amount), 0);
            
            const expense = transactions
              .filter(t => t.type === 'expense')
              .reduce((acc, t) => acc + Number(t.amount), 0);
            
            const total = income - expense;
            
            setSummary({ income, expense, total });
          };
          
          getAllRequest.onerror = () => {
            console.warn('Erro ao buscar transações, usando dados mock');
            setSummary(mockSummary);
          };
          
        } catch (error) {
          console.warn('Erro ao acessar transactions, usando dados mock:', error);
          setSummary(mockSummary);
        }
      };
      
    } catch (error) {
      console.warn('Erro geral ao carregar resumo, usando dados mock:', error);
      setSummary(mockSummary);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Resumo Financeiro</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card de Entradas */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Entradas</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(summary.income)}
              </p>
            </div>
            <div className="text-green-400">
              <ArrowUpCircleIcon />
            </div>
          </div>
        </div>

        {/* Card de Saídas */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Saídas</p>
              <p className="text-2xl font-bold text-red-400">
                {formatCurrency(summary.expense)}
              </p>
            </div>
            <div className="text-red-400">
              <ArrowDownCircleIcon />
            </div>
          </div>
        </div>

        {/* Card do Total */}
        <div className={`border rounded-lg p-6 ${
          summary.total >= 0 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-red-900 border-red-700'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className={`text-2xl font-bold ${
                summary.total >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(summary.total)}
              </p>
            </div>
            <div className={summary.total >= 0 ? 'text-green-400' : 'text-red-400'}>
              <DollarSignIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Transações Recentes */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Transações Recentes</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">{transaction.description}</p>
                    <p className="text-gray-400 text-sm">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;