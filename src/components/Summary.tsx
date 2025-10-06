import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'outcome';
  category: string;
  createdAt: Date;
}

const Summary: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({
    income: 0,
    outcome: 0,
    total: 0
  });

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const db = await openDatabase();
        const transaction = db.transaction(['transactions'], 'readonly');
        const store = transaction.objectStore('transactions');
        const request = store.getAll();

        request.onsuccess = () => {
          const transactionsList = request.result.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt)
          }));
          setTransactions(transactionsList);
          calculateSummary(transactionsList);
        };
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      }
    };

    loadTransactions();
  }, []);

  const calculateSummary = (transactionsList: Transaction[]) => {
    const income = transactionsList
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const outcome = transactionsList
      .filter(t => t.type === 'outcome')
      .reduce((sum, t) => sum + t.amount, 0);

    setSummary({
      income,
      outcome,
      total: income - outcome
    });
  };

  const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('dtmoney', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('transactions')) {
          db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card de Entradas */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Entradas</p>
            <p className="text-2xl font-bold text-green-400 mt-2">
              {formatCurrency(summary.income)}
            </p>
          </div>
          <div className="bg-green-900/30 p-3 rounded-full">
            <ArrowUpCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Card de Saídas */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Saídas</p>
            <p className="text-2xl font-bold text-red-400 mt-2">
              {formatCurrency(summary.outcome)}
            </p>
          </div>
          <div className="bg-red-900/30 p-3 rounded-full">
            <ArrowDownCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Card do Total */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Total</p>
            <p className={`text-2xl font-bold mt-2 ${
              summary.total >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(summary.total)}
            </p>
          </div>
          <div className={`${summary.total >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'} p-3 rounded-full`}>
            <DollarSign className={`w-8 h-8 ${
              summary.total >= 0 ? 'text-green-400' : 'text-red-400'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;