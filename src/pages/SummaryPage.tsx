import { useState, useEffect } from 'react';
import Summary from '../components/Summary';
import TransactionChart from '../components/TransactionChart';
import { useIndexedDB } from '../hooks/useIndexedDB';

const SummaryPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
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
      
      console.log('SummaryPage - Dados carregados:', transactionsData);
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
        }
      ];
      setTransactions(mockData);
      setCategories(['Salário', 'Alimentação', 'Moradia', 'Transporte', 'Lazer']);
    }
  };

  const calculateSummary = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.price, 0);
    
    const outcome = transactions
      .filter(t => t.type === 'outcome')
      .reduce((sum, t) => sum + t.price, 0);
    
    const total = income - outcome;
    
    return { income, outcome, total };
  };

  const getTransactionsByCategory = () => {
    const categoryData: { [key: string]: number } = {};
    
    transactions
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

  const summary = calculateSummary();
  const chartData = getTransactionsByCategory();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Resumo Financeiro</h1>
        <p className="text-gray-400">Análise detalhada da sua saúde financeira</p>
      </div>
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Receitas</p>
              <p className="text-2xl font-bold text-green-400">
                R$ {summary.income.toFixed(2)}
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
                R$ {summary.outcome.toFixed(2)}
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
              <p className={`text-2xl font-bold ${summary.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                R$ {summary.total.toFixed(2)}
              </p>
            </div>
            <div className={`w-12 h-12 ${summary.total >= 0 ? 'bg-green-900' : 'bg-red-900'} rounded-full flex items-center justify-center`}>
              <svg className={`w-6 h-6 ${summary.total >= 0 ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Despesas por Categoria</h2>
          <TransactionChart data={chartData} type="pie" />
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Resumo Mensal</h2>
          <Summary />
        </div>
      </div>

      {/* Estatísticas Adicionais */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Estatísticas Detalhadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Total de Transações</p>
            <p className="text-2xl font-bold text-white">{transactions.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Média de Despesas</p>
            <p className="text-2xl font-bold text-white">
              R$ {summary.outcome > 0 ? (summary.outcome / transactions.filter(t => t.type === 'outcome').length).toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Maior Despesa</p>
            <p className="text-2xl font-bold text-white">
              R$ {transactions.filter(t => t.type === 'outcome').length > 0 
                ? Math.max(...transactions.filter(t => t.type === 'outcome').map(t => t.price)).toFixed(2)
                : '0.00'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Categories Ativas</p>
            <p className="text-2xl font-bold text-white">{categories.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;