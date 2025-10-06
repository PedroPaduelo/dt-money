import { useState, useEffect } from 'react';
import FinancialReports from '../components/FinancialReports';
import TransactionChart from '../components/TransactionChart';
import { useIndexedDB } from '../hooks/useIndexedDB';

const ReportsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const { getTransactions, isReady, getCategories } = useIndexedDB();

  useEffect(() => {
    if (isReady) {
      loadData();
    }
  }, [isReady]);

  const loadData = async () => {
    try {
      const transactionsData = await getTransactions();
      setTransactions(transactionsData);
      
      const categoriesData = await getCategories();
      const categoryNames = categoriesData.map(cat => cat.name);
      setCategories(categoryNames);
      
      console.log('ReportsPage - Dados carregados:', transactionsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      const mockData = [
        {
          id: '1',
          description: 'Salário',
          price: 5000,
          category: 'Salário',
          date: new Date().toISOString(),
          type: 'income' as const
        },
        {
          id: '2', 
          description: 'Aluguel',
          price: 1500,
          category: 'Moradia',
          date: new Date().toISOString(),
          type: 'outcome' as const
        },
        {
          id: '3',
          description: 'Supermercado',
          price: 500,
          category: 'Alimentação',
          date: new Date(Date.now() - 86400000).toISOString(),
          type: 'outcome' as const
        },
        {
          id: '4',
          description: 'Gasolina',
          price: 200,
          category: 'Transporte',
          date: new Date(Date.now() - 172800000).toISOString(),
          type: 'outcome' as const
        },
        {
          id: '5',
          description: 'Cinema',
          price: 80,
          category: 'Lazer',
          date: new Date(Date.now() - 259200000).toISOString(),
          type: 'outcome' as const
        }
      ];
      setTransactions(mockData);
      setCategories(['Salário', 'Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde']);
    }
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const getTransactionsByCategory = () => {
    const filteredTransactions = getFilteredTransactions();
    const categoryData: { [key: string]: number } = {};
    
    filteredTransactions
      .filter(t => t.type === 'outcome')
      .forEach(t => {
        if (categoryData[t.category]) {
          categoryData[t.category] += t.price;
        } else {
          categoryData[t.category] = t.price;
        }
      });
    
    return Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  const getMonthlyEvolution = () => {
    const monthlyData: { [key: string]: { income: number; outcome: number } } = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, outcome: 0 };
      }
      
      if (t.type === 'income') {
        monthlyData[monthKey].income += t.price;
      } else {
        monthlyData[monthKey].outcome += t.price;
      }
    });
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        ...data,
        balance: data.income - data.outcome
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Últimos 6 meses
  };

  const chartData = getTransactionsByCategory();
  const evolutionData = getMonthlyEvolution();
  const filteredTransactions = getFilteredTransactions();

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.price, 0);
  
  const totalOutcome = filteredTransactions
    .filter(t => t.type === 'outcome')
    .reduce((sum, t) => sum + t.price, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios Financeiros</h1>
          <p className="text-gray-400">Análise detalhada do seu comportamento financeiro</p>
        </div>
        
        <div className="flex space-x-2">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {period === 'week' ? 'Semana' : 
               period === 'month' ? 'Mês' : 
               period === 'quarter' ? 'Trimestre' : 'Ano'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Cards de Resumo do Período */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Receitas</p>
              <p className="text-2xl font-bold text-green-400">
                R$ {totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Despesas</p>
              <p className="text-2xl font-bold text-red-400">
                R$ {totalOutcome.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Saldo</p>
              <p className={`text-2xl font-bold ${(totalIncome - totalOutcome) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                R$ {(totalIncome - totalOutcome).toFixed(2)}
              </p>
            </div>
            <div className={`w-12 h-12 ${(totalIncome - totalOutcome) >= 0 ? 'bg-green-900' : 'bg-red-900'} rounded-full flex items-center justify-center`}>
              <svg className={`w-6 h-6 ${(totalIncome - totalOutcome) >= 0 ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Economia</p>
              <p className="text-2xl font-bold text-blue-400">
                {totalIncome > 0 ? Math.round(((totalIncome - totalOutcome) / totalIncome) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Despesas por Categoria</h2>
          <TransactionChart data={chartData} type="pie" />
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Evolução Mensal</h2>
          <TransactionChart data={evolutionData} type="line" />
        </div>
      </div>

      {/* Relatórios Detalhados */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <FinancialReports 
          transactions={filteredTransactions}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default ReportsPage;