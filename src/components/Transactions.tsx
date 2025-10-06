import React, { useState, useEffect } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';

const Transactions = () => {
  const { transactions, categories, loading } = useIndexedDB();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [itemsPerPage] = useState(10);

  // Filtrar transações
  const filteredTransactions = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesType;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [transactions, searchTerm, filterType, sortBy, sortOrder]);

  // Corrigido: Adicionada verificação de nulos e array fallback
  const [displayedTransactions, setDisplayedTransactions] = useState(
    filteredTransactions && filteredTransactions.length > 0 
      ? filteredTransactions.slice(0, itemsPerPage)
      : []
  );

  const totalPages = Math.ceil((filteredTransactions?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredTransactions?.length || 0);

  // Corrigido: useEffect com verificação segura
  useEffect(() => {
    if (filteredTransactions && filteredTransactions.length > 0) {
      setDisplayedTransactions(filteredTransactions.slice(startIndex, endIndex));
    } else {
      setDisplayedTransactions([]);
    }
  }, [filteredTransactions, startIndex, endIndex]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      const { db } = useIndexedDB();
      await db.deleteItem('transactions', id);
      setEditingTransaction(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCategoryName = (categoryId) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sem categoria';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando transações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Transações</h2>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar transação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todos</option>
            <option value="income">Entradas</option>
            <option value="expense">Saídas</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="date">Data</option>
            <option value="amount">Valor</option>
            <option value="description">Descrição</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Tabela de Transações */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 text-gray-400 font-medium">Data</th>
                <th className="pb-3 text-gray-400 font-medium">Descrição</th>
                <th className="pb-3 text-gray-400 font-medium">Categoria</th>
                <th className="pb-3 text-gray-400 font-medium text-right">Valor</th>
                <th className="pb-3 text-gray-400 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions && displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-4 text-gray-300">{formatDate(transaction.date)}</td>
                    <td className="py-4 text-white">{transaction.description}</td>
                    <td className="py-4 text-gray-300">{getCategoryName(transaction.category)}</td>
                    <td className={`py-4 text-right font-medium ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    Nenhuma transação encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Anterior
            </button>
            
            <span className="text-gray-300">
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;