import { useState, useEffect } from 'react';
import Summary from '../components/Summary';
import Transactions from '../components/Transactions';
import { useIndexedDB } from '../hooks/useIndexedDB';

const Dashboard = () => {
  // Estado para armazenar dados reais
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Hook para integração com IndexedDB
  const { getTransactions, isReady, getCategories } = useIndexedDB();

  useEffect(() => {
    // Carregar dados quando o banco estiver pronto
    if (isReady) {
      loadData();
    }
  }, [isReady]);

  const loadData = async () => {
    try {
      // Carregar transações
      const transactionsData = await getTransactions();
      setTransactions(transactionsData);
      
      // Carregar categorias
      const categoriesData = await getCategories();
      const categoryNames = categoriesData.map(cat => cat.name);
      setCategories(categoryNames);
      
      console.log('Dashboard - Dados carregados com sucesso!');
      console.log('Transações:', transactionsData);
      console.log('Categorias:', categoryNames);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Dados mock em caso de erro
      setTransactions([
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
      ]);
      setCategories(['Salário', 'Alimentação', 'Moradia', 'Transporte', 'Lazer']);
    }
  };

  const handleEditTransaction = (transaction: any) => {
    console.log('Edit transaction:', transaction);
    // Implementar lógica de edição
  };

  const handleDeleteTransaction = (id: string) => {
    console.log('Delete transaction:', id);
    // Implementar lógica de exclusão
  };

  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
    // Implementar lógica de busca
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Visão geral da sua vida financeira</p>
      </div>
      
      <Summary />
      
      <Transactions 
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onSearch={handleSearch}
        categories={categories}
      />
    </div>
  );
};

export default Dashboard;