import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Summary from "./Summary";
import Transactions from "./Transactions";
import NewTransactionModal from "./NewTransactionModal";
import { useIndexedDB } from "../hooks/useIndexedDB";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const location = useLocation();
  
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

  const handleTransactionSave = (transactionData: any) => {
    console.log('Save transaction:', transactionData);
    // Implementar lógica de salvamento
  };

  const isHomePage = location.pathname === '/';
  const isTransactionsPage = location.pathname === '/transactions';

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg shadow-md border border-gray-700"
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
          className="text-gray-300"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      {/* Sidebar */}
      <div className={`fixed lg:relative lg:flex lg:flex-col w-64 bg-gray-800 border-r border-gray-700 z-50 h-full transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
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
            <Outlet />
            {/* Conteúdo original na home */}
            {isHomePage && (
              <div className="p-6 space-y-6">
                <Summary />
                <Transactions 
                  transactions={transactions}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                  onSearch={handleSearch}
                  categories={categories}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <NewTransactionModal 
          isOpen={showNewTransactionModal}
          onClose={() => setShowNewTransactionModal(false)}
          onSave={handleTransactionSave}
        />
      )}
    </div>
  );
};

export default Layout;