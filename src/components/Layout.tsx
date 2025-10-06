import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Summary from "./Summary";
import NewTransactionModal from "./NewTransactionModal";
import Transactions from "./Transactions";
import { useIndexedDB } from "../hooks/useIndexedDB";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  
  // Hook para integração com IndexedDB
  const { getTransactions, isReady, getCategories } = useIndexedDB();
  
  // Estado para armazenar dados reais
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

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
      
      console.log('DT Money - Dados carregados com sucesso!');
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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNewTransactionModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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

  const handleTransactionSuccess = () => {
    // Recarregar dados quando uma nova transação for adicionada
    loadData();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:flex flex-col w-64 bg-white border-r border-gray-200 z-50 h-full
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Header 
            onOpenNewTransactionModal={() => setShowNewTransactionModal(true)} 
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="flex-1">
            <Summary />
            <Transactions 
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onSearch={handleSearch}
              categories={categories}
            />
          </main>
        </div>
      </div>

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <NewTransactionModal 
          onClose={() => setShowNewTransactionModal(false)}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
};

export default Layout;