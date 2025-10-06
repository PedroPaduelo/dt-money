import { useState, useEffect } from 'react';
import Transactions from '../components/Transactions';
import SearchFilters from '../components/SearchFilters';
import { useIndexedDB } from '../hooks/useIndexedDB';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  
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
      setFilteredTransactions(transactionsData);
      
      const categoriesData = await getCategories();
      const categoryNames = categoriesData.map(cat => cat.name);
      setCategories(categoryNames);
      
      console.log('TransactionsPage - Dados carregados:', transactionsData);
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
      setFilteredTransactions(mockData);
      setCategories(['Salário', 'Alimentação', 'Moradia', 'Transporte', 'Lazer']);
    }
  };

  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
    
    let filtered = [...transactions];
    
    if (filters.search) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      });
    }
    
    setFilteredTransactions(filtered);
  };

  const handleEditTransaction = (transaction: any) => {
    console.log('Edit transaction:', transaction);
    // Implementar lógica de edição
  };

  const handleDeleteTransaction = (id: string) => {
    console.log('Delete transaction:', id);
    // Implementar lógica de exclusão
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    setFilteredTransactions(newTransactions);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Transações</h1>
        <p className="text-gray-400">Gerencie todas as suas transações financeiras</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <SearchFilters 
          onSearch={handleSearch}
          categories={categories}
        />
      </div>
      
      <Transactions 
        transactions={filteredTransactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onSearch={handleSearch}
        categories={categories}
      />
    </div>
  );
};

export default TransactionsPage;