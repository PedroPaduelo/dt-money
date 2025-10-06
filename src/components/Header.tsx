import { useState, useEffect } from "react";
import { useIndexedDB } from "../hooks/useIndexedDB";

const Header = ({ 
  onNewTransaction = () => {},
  onMenuToggle = () => {},
  showMenuButton = false,
  isMobile = false 
}) => {
  const [date, setDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, total: 0 });
  const { getAllItems } = useIndexedDB();

  useEffect(() => {
    // Atualizar data
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    setDate(formattedDate);

    // Carregar transações
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const items = await getAllItems();
      setTransactions(items || []);
      
      // Calcular resumo
      const income = items
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + Number(item.amount), 0);
      
      const expense = items
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + Number(item.amount), 0);
      
      setSummary({
        income,
        expense,
        total: income - expense
      });
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Título - Alinhado à Esquerda */}
          <div className="flex items-center">
            {showMenuButton && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 mr-4"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">$</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-white">DT Money</h1>
                <p className="text-sm text-gray-400">{date}</p>
              </div>
            </div>
          </div>

          {/* Resumo e Botão - Alinhado à Direita */}
          <div className="flex items-center space-x-4">
            {/* Resumo (Desktop) */}
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Entradas</p>
                  <p className="text-lg font-semibold text-green-400">
                    {summary.income.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Saídas</p>
                  <p className="text-lg font-semibold text-red-400">
                    {summary.expense.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                </div>
                <div className="text-right border-l border-gray-700 pl-6">
                  <p className="text-sm text-gray-400">Total</p>
                  <p className={`text-lg font-bold ${
                    summary.total >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {summary.total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Botão Nova Transação */}
            <button
              onClick={onNewTransaction}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Nova Transação</span>
            </button>
          </div>
        </div>

        {/* Resumo Mobile */}
        {isMobile && (
          <div className="pb-4 border-t border-gray-800 mt-4">
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">Entradas</p>
                <p className="text-lg font-semibold text-green-400">
                  {summary.income.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Saídas</p>
                <p className="text-lg font-semibold text-red-400">
                  {summary.expense.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Total</p>
                <p className={`text-lg font-bold ${
                  summary.total >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {summary.total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;