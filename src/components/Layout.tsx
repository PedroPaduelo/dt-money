import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Summary from "./Summary";
import Transactions from "./Transactions";
import NewTransactionModal from "./NewTransactionModal";
import { useIndexedDB } from "../hooks/useIndexedDB";

// Componente de tabela de categorias
const CategoriesTable = ({ 
  categories, 
  setCategories, 
  isModalOpen, 
  setIsModalOpen, 
  editingCategory, 
  setEditingCategory,
  handleCreateCategory,
  handleEditCategory,
  handleDeleteCategory,
  setNewCategory,
  newCategory
}) => {
  const CategoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-white">
          {editingCategory ? "Editar Categoria" : "Nova Categoria"}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nome da Categoria
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex: Alimentação"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo
            </label>
            <select
              value={newCategory.type}
              onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cor
            </label>
            <input
              type="color"
              value={newCategory.color}
              onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
              className="w-full h-10 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Ícone
            </label>
            <input
              type="text"
              value={newCategory.icon}
              onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex: 🍔"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setIsModalOpen(false);
              setEditingCategory(null);
              setNewCategory({ name: "", color: "#10b981", icon: "📝", type: "expense" });
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (editingCategory) {
                handleEditCategory();
              } else {
                handleCreateCategory();
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            {editingCategory ? "Salvar" : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Gerenciar Categorias</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>Nova Categoria</span>
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Cor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Ícone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded border border-gray-600"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.color}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-2xl">
                  {category.icon}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    category.type === 'income' 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-red-900 text-red-200'
                  }`}>
                    {category.type === 'income' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setNewCategory(category);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <CategoryModal />}
    </div>
  );
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { db, loading, error } = useIndexedDB();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Salário', color: '#10b981', icon: '💰', type: 'income' },
    { id: 2, name: 'Alimentação', color: '#ef4444', icon: '🍔', type: 'expense' },
    { id: 3, name: 'Transporte', color: '#f59e0b', icon: '🚗', type: 'expense' },
    { id: 4, name: 'Moradia', color: '#3b82f6', icon: '🏠', type: 'expense' },
    { id: 5, name: 'Lazer', color: '#8b5cf6', icon: '🎮', type: 'expense' },
    { id: 6, name: 'Investimentos', color: '#06b6d4', icon: '📈', type: 'income' }
  ]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", color: "#10b981", icon: "📝", type: "expense" });

  const loadTransactions = async () => {
    if (db) {
      try {
        const allTransactions = await db.getItems('transactions');
        setTransactions(allTransactions || []);
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      }
    }
  };

  useEffect(() => {
    if (db) {
      loadTransactions();
    }
  }, [db]);

  const handleCreateTransaction = async (transactionData) => {
    try {
      await db.addItem('transactions', {
        ...transactionData,
        id: Date.now(),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      await loadTransactions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    }
  };

  // Funções para gerenciar categorias
  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const category = {
      id: Date.now(),
      ...newCategory
    };
    
    setCategories([...categories, category]);
    setIsModalOpen(false);
    setNewCategory({ name: "", color: "#10b981", icon: "📝", type: "expense" });
  };

  const handleEditCategory = () => {
    if (!newCategory.name.trim() || !editingCategory) return;
    
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? { ...cat, ...newCategory } : cat
    ));
    
    setIsModalOpen(false);
    setEditingCategory(null);
    setNewCategory({ name: "", color: "#10b981", icon: "📝", type: "expense" });
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Summary transactions={transactions} />;
      case 'transactions':
        return <Transactions transactions={transactions} onTransactionsChange={loadTransactions} />;
      case 'summary':
        return <Summary transactions={transactions} />;
      case 'budgets':
        return (
          <div className="flex-1 bg-gray-900 p-6">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-400 mb-4">Orçamentos</h2>
              <p className="text-gray-500">Funcionalidade em desenvolvimento.</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="flex-1 bg-gray-900 p-6">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-400 mb-4">Relatórios</h2>
              <p className="text-gray-500">Funcionalidade em desenvolvimento.</p>
            </div>
          </div>
        );
      case 'categories':
        return (
          <div className="flex-1 bg-gray-900 p-6">
            <CategoriesTable
              categories={categories}
              setCategories={setCategories}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              handleCreateCategory={handleCreateCategory}
              handleEditCategory={handleEditCategory}
              handleDeleteCategory={handleDeleteCategory}
              setNewCategory={setNewCategory}
              newCategory={newCategory}
            />
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 bg-gray-900 p-6">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-400 mb-4">Configurações</h2>
              <p className="text-gray-500">Funcionalidade em desenvolvimento.</p>
            </div>
          </div>
        );
      default:
        return <Summary transactions={transactions} />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-400">Erro: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        <Header onNewTransaction={() => setIsModalOpen(true)} />
        
        {renderPage()}
        
        {/* Botão menu mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Sidebar mobile */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      )}
      
      {/* Modal de nova transação */}
      {isModalOpen && (
        <NewTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateTransaction}
        />
      )}
    </div>
  );
};

export default Layout;