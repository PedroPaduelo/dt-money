import { useState, useEffect } from 'react';
import BudgetManager from '../components/BudgetManager';
import { useIndexedDB } from '../hooks/useIndexedDB';

const BudgetsPage = () => {
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
      
      console.log('BudgetsPage - Dados carregados:', transactionsData);
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
        }
      ];
      setTransactions(mockData);
      setCategories(['Salário', 'Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde']);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Orçamentos</h1>
        <p className="text-gray-400">Defina e acompanhe seus limites de gastos por categoria</p>
      </div>
      
      {/* Visão Geral dos Orçamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Alimentação</h3>
            <span className="text-2xl">🍔</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gasto atual</span>
              <span className="text-white font-medium">R$ 850,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Limite</span>
              <span className="text-white font-medium">R$ 1.200,00</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '71%' }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">71% do orçamento utilizado</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Transporte</h3>
            <span className="text-2xl">🚗</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gasto atual</span>
              <span className="text-white font-medium">R$ 450,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Limite</span>
              <span className="text-white font-medium">R$ 500,00</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
            <p className="text-xs text-red-400 mt-2">90% do orçamento utilizado</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Lazer</h3>
            <span className="text-2xl">🎮</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gasto atual</span>
              <span className="text-white font-medium">R$ 200,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Limite</span>
              <span className="text-white font-medium">R$ 800,00</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">25% do orçamento utilizado</p>
          </div>
        </div>
      </div>

      {/* Gerenciador de Orçamentos */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">Gerenciar Orçamentos</h2>
        <BudgetManager 
          transactions={transactions}
          categories={categories}
        />
      </div>

      {/* Dicas e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Alerta de Orçamento</h3>
              <p className="text-yellow-200 text-sm">
                Você está próximo do limite na categoria Transporte (90% utilizado). 
                Considere reduzir gastos ou aumentar o limite.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Dica de Economia</h3>
              <p className="text-green-200 text-sm">
                Você economizou R$ 600,00 este mês na categoria Lazer. 
                Considere investir esse valor ou criar uma reserva de emergência.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetsPage;