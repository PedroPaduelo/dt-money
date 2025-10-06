import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Summary from "./Summary";
import Transactions from "./Transactions";
import NewTransactionModal from "./NewTransactionModal";

const Layout = ({ currentPage, setCurrentPage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const transactionStore = localStorage.getItem('dtmoney_transactions');
        const categoriesStore = localStorage.getItem('dtmoney_categories');
        
        if (transactionStore) {
          const parsedTransactions = JSON.parse(transactionStore);
          const transactionsWithDate = parsedTransactions.map(transaction => ({
            ...transaction,
            date: transaction.date || new Date().toISOString()
          }));
          setTransactions(transactionsWithDate);
        }

        if (categoriesStore) {
          setCategories(JSON.parse(categoriesStore));
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  const handleSaveTransaction = (transaction) => {
    try {
      const updatedTransactions = [
        {
          ...transaction,
          id: Date.now().toString(),
          date: transaction.date || new Date().toISOString()
        },
        ...transactions
      ];
      setTransactions(updatedTransactions);
      localStorage.setItem('dtmoney_transactions', JSON.stringify(updatedTransactions));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const renderContent = () => {
    switch (currentPage) {
      case 'transactions':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-300">Transações</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nova Transação
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
              >
                <option value="all">Todos</option>
                <option value="income">Entradas</option>
                <option value="expense">Saídas</option>
              </select>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-400">Descrição</th>
                    <th className="text-left p-4 text-gray-400">Categoria</th>
                    <th className="text-left p-4 text-gray-400">Data</th>
                    <th className="text-right p-4 text-gray-400">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="p-4 text-gray-300">{transaction.description}</td>
                        <td className="p-4 text-gray-300">{transaction.category}</td>
                        <td className="p-4 text-gray-300">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className={`p-4 text-right font-medium ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          R$ {transaction.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        Nenhuma transação encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-300">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-400 mb-2">Saldo Total</p>
                <p className="text-3xl font-bold text-gray-300">
                  R$ {transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-400 mb-2">Entradas</p>
                <p className="text-3xl font-bold text-green-400">
                  R$ {transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-400 mb-2">Saídas</p>
                <p className="text-3xl font-bold text-red-400">
                  R$ {transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Últimas Transações</h3>
              <div className="space-y-2">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <div>
                      <p className="text-gray-300">{transaction.description}</p>
                      <p className="text-sm text-gray-400">{transaction.category}</p>
                    </div>
                    <span className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'summary':
        return <Summary transactions={transactions} categories={categories} />;

      case 'budgets':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-300">Orçamentos</h2>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400">Funcionalidade de orçamentos em desenvolvimento.</p>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-300">Relatórios</h2>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400">Funcionalidade de relatórios em desenvolvimento.</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-300">Configurações</h2>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400">Funcionalidade de configurações em desenvolvimento.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-300">Dashboard</h2>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400">Bem-vindo ao DT Money!</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-0 z-40 lg:z-auto transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } transition-transform duration-300 ease-in-out bg-gray-800 border-r border-gray-700 lg:block w-64 min-h-screen`}>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>

      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
      />
    </div>
  );
};

export default Layout;